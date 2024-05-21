import { useEffect, useState } from "react";
function WalletConnection() {
  const [walletAddress, setWalletAddress] = useState("");
  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window !== "undefined") {
      const savedWalletAddress = localStorage.getItem("walletAddress");
      if (savedWalletAddress) {
        setWalletAddress(savedWalletAddress);
        connectWallet(savedWalletAddress); // 수동으로 연결 상태 복원
      }
    }
  }, []);
  async function connectWallet(address) {
    // Rainbow Kit의 connect 기능 호출
    const wallet = await someRainbowKitFunctionToConnectWallet(address);
    setWalletAddress(wallet.address);
    localStorage.setItem("walletAddress", wallet.address);
  }
  return (
    <div>
      {" "}
      <button onClick={() => connectWallet("some_address")}>
        Connect Wallet
      </button>{" "}
      <p>Connected Wallet: {walletAddress}</p>{" "}
    </div>
  );
}
