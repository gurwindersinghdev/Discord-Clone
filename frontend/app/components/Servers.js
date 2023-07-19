import ethereum from "../assets/ethereum.svg";
import plus from "../assets/plus.svg";
import search from "../assets/search.svg";
import Image from "next/image";

const Servers = () => {
  return (
    <div className="servers">
      <div className="server">
        <Image src={ethereum} alt="Ethereum Logo" />
      </div>
      <div className="server">
        <Image src={plus} alt="Add Server" />
      </div>
      <div className="server">
        <Image src={search} alt="Add Server" />
      </div>
    </div>
  );
};

export default Servers;
