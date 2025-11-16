"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useAccount, useConnect, useSendTransaction } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { parseEther } from "viem";

const dishNames: Record<string, string> = {
  rendang: "Rendang Padang",
  nasigoreng: "Nasi Goreng Jawa",
  sotoayam: "Soto Ayam",
  rawon: "Rawon Surabaya",
  cotomakassar: "Coto Makassar",
  gudeg: "Gudeg Jogja",
  pempek: "Pempek Palembang",
};

// GANTI ini ke alamat wallet lu sendiri (treasury / dev wallet)
const RECEIVER_ADDRESS = "0x56348299d7c5D483d3677EF853Eb8755D9fC14a6";

// Harga “~$0.01” versi dev (super kecil supaya hemat testnet)
const TIP_VALUE = "0.00001";

export default function ConnectPage() {
  const params = useParams();
  const dishKey = (params?.dish as string) || "";
  const dishName = dishNames[dishKey] ?? dishKey;

  const router = useRouter();

  const { address, isConnected } = useAccount();
  const {
    connectAsync,
    connectors,
    isPending: isConnecting,
  } = useConnect();

  const {
    sendTransaction,
    data: txHash,
    isPending: isSending,
    error: txError,
  } = useSendTransaction();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);

  // key untuk simpan status unlock di localStorage
  const unlockKey = useMemo(() => {
    if (!address) return null;
    return `onchain-dish::${address.toLowerCase()}::${dishKey}`;
  }, [address, dishKey]);

  // cek apakah sudah pernah unlock dish ini dengan wallet ini
  useEffect(() => {
    if (!unlockKey) return;
    if (typeof window === "undefined") return;

    const value = window.localStorage.getItem(unlockKey);
    if (value === "unlocked") {
      setIsUnlocked(true);
    }
  }, [unlockKey]);

    useEffect(() => {
    setMounted(true);
  }, []);

  // kalau tx sukses → tandai unlocked + redirect ke success page
  useEffect(() => {
    if (!txHash) return;
    if (!unlockKey) return;
    if (typeof window === "undefined") return;

    window.localStorage.setItem(unlockKey, "unlocked");
    setIsUnlocked(true);
    router.push(`/frame/list/${dishKey}/success`);
  }, [txHash, unlockKey, router, dishKey]);

  // kalau TX error, tampilin pesan yang lebih jelas
  useEffect(() => {
    if (!txError) return;

    console.error("Transaction error:", txError);

    const name = (txError as any)?.name as string | undefined;
    // @ts-expect-error wagmi error kadang punya shortMessage
    const shortMessage = txError.shortMessage as string | undefined;

    if (name === "InsufficientFundsError") {
      setErrorMessage(
        "Not enough ETH on Base Sepolia to pay for this transaction."
      );
      return;
    }

    if (name === "ConnectorNotConnectedError") {
      setErrorMessage(
        "Wallet is not connected. Please connect your wallet and try again."
      );
      return;
    }

    if (name === "ConnectorAlreadyConnectedError") {
      // Harusnya udah ketangani sama isConnected check,
      // tapi kalau masih kejadian, anggap aja sudah tersambung.
      setErrorMessage(null);
      return;
    }

    setErrorMessage(shortMessage || "Transaction failed. Please try again.");
  }, [txError]);

  const handleConnectAndPay = async () => {
    setErrorMessage(null);

    try {
      // Kalau sudah pernah unlock → langsung ke success
      if (isUnlocked) {
        router.push(`/frame/list/${dishKey}/success`);
        return;
      }

      let connectedAccount: `0x${string}` | undefined;

      // 1. Kalau sudah connected, pakai address yang ada
      if (isConnected && address) {
        connectedAccount = address as `0x${string}`;
      } else {
        // 2. Kalau belum connected → connect via injected wallet (MetaMask/OKX)
        const injectedConnector =
          connectors.find((c) => c.id === "injected") ||
          connectors.find((c) =>
            c.name.toLowerCase().includes("metamask")
          ) ||
          connectors[0];

        if (!injectedConnector) {
          setErrorMessage("No browser wallet found. Please install MetaMask.");
          return;
        }

        try {
          const result = await connectAsync({
            connector: injectedConnector,
            chainId: baseSepolia.id, // minta switch ke Base Sepolia
          });

          if (result.accounts && result.accounts.length > 0) {
            connectedAccount = result.accounts[0] as `0x${string}`;
          }
        } catch (err: any) {
          console.error("Connect error:", err);

          if (err?.name === "ConnectorAlreadyConnectedError" && address) {
            connectedAccount = address as `0x${string}`;
          } else {
            setErrorMessage("Failed to connect wallet. Please try again.");
            return;
          }
        }
      }

      if (!connectedAccount) {
        setErrorMessage("Wallet is not connected.");
        return;
      }

      // 3. Kirim transaksi kecil ke RECEIVER_ADDRESS
      sendTransaction({
        account: connectedAccount,
        chainId: baseSepolia.id,
        to: RECEIVER_ADDRESS as `0x${string}`,
        value: parseEther(TIP_VALUE),
      });
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 flex justify-center">
      <div className="max-w-md w-full space-y-4">
        <header className="space-y-2">
          <h1 className="text-xl font-semibold">
            Unlock & mint {dishName || "this recipe"}
          </h1>
          <p className="text-xs text-muted-foreground">
            Connect your wallet and pay a tiny onchain fee (~$0.01) to mint the
            full recipe, step-by-step instructions, and cooking notes for{" "}
            <span className="font-medium">{dishName}</span> into your onchain
            kitchen.
          </p>
        </header>

        <section className="space-y-1">
          <h2 className="text-sm font-medium">How it works</h2>
          <ol className="text-[11px] text-muted-foreground list-decimal list-inside space-y-1">
            <li>Connect your browser wallet (MetaMask, OKX, etc.).</li>
            <li>
              Make sure your wallet is on <b>Base Sepolia</b> and has a bit of
              test ETH.
            </li>
            <li>
              Confirm the payment, and we mint this recipe into your onchain
              kitchen.
            </li>
          </ol>
        </section>

        {mounted && address && (
          <p className="text-[11px] text-muted-foreground">
            Last connected as{" "}
            <span className="font-mono">
              {address.slice(0, 6)}…{address.slice(-4)}
            </span>
            {isUnlocked && " • already minted"}
          </p>
        )}


        {errorMessage && (
          <p className="text-[11px] text-red-500">{errorMessage}</p>
        )}

        <Button
          className="w-full"
          onClick={handleConnectAndPay}
          disabled={isConnecting || isSending}
        >
          {isConnecting
            ? "Connecting wallet..."
            : isSending
            ? "Waiting for confirmation..."
            : isUnlocked
            ? "Open mint success screen"
            : isConnected
            ? `Mint recipe ~${TIP_VALUE} ETH`
            : `Connect wallet & mint recipe ~${TIP_VALUE} ETH`}
        </Button>


        <p className="text-[10px] text-muted-foreground text-center">
          This small onchain fee mints the recipe to your wallet. Think of it as
          saving a new dish into a shelf in your onchain kitchen.
        </p>
      </div>
    </main>
  );
}
