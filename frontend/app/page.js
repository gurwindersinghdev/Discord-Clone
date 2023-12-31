"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { io } from "socket.io-client";

// Components
import Navigation from "./components/Navigation";
import Servers from "./components/Servers";
import Channels from "./components/Channels";
import Messages from "./components/Messages";

// ABIs
import Discordd from "./Discordd.json";

// Config
import config from "./config.json";

// Socket
const socket = io("ws://localhost:3030");

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const [discord, setDiscord] = useState(null);
  const [channels, setChannels] = useState([]);

  const [currentChannel, setCurrentChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  // Function to load blockchain data and set up event listener
  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    const discord = new ethers.Contract(
      config[network.chainId].Discord.address,
      Discordd,
      provider
    );
    setDiscord(discord);

    const totalChannels = await discord.totalChannels();
    const channels = [];

    for (let i = 1; i <= totalChannels; i++) {
      const channel = await discord.getChannel(i);
      channels.push(channel);
    }

    setChannels(channels);

    // Set up an event listener for "accountsChanged" event
    window.ethereum.on("accountsChanged", async () => {
      window.location.reload();
    });
  };

  useEffect(() => {
    loadBlockchainData();

    // --> https://socket.io/how-to/use-with-react-hooks

    socket.on("connect", () => {
      socket.emit("get messages");
    });

    socket.on("new message", (messages) => {
      setMessages(messages);
    });

    socket.on("get messages", (messages) => {
      setMessages(messages);
    });

    return () => {
      socket.off("connect");
      socket.off("new message");
      socket.off("get messages");
    };
  }, []);
  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <main>
        <Servers />

        <Channels
          provider={provider}
          account={account}
          discord={discord}
          channels={channels}
          currentChannel={currentChannel}
          setCurrentChannel={setCurrentChannel}
        />

        <Messages
          account={account}
          messages={messages}
          currentChannel={currentChannel}
        />
      </main>
    </div>
  );
}
