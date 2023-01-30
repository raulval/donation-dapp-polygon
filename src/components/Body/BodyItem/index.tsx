declare let window: any;
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import Identicon from "identicon.js";
import DataRoot from "../../../context/DataRoot";

type BodyItemsProps = {
  address: string;
  description: string;
  totalDonations: any;
  hash: string;
  id: string;
};

const BodyItem = ({
  address,
  description,
  totalDonations,
  hash,
  id,
}: BodyItemsProps) => {
  const { donateImageOwner, updateImages } = DataRoot;
  var data = new Identicon(address, 200).toString();

  return (
    <div class="w-full md:mx-0 md:max-w-2xl mt-5 p-3 border rounded-xl flex flex-col">
      <div class="flex flex-row space-x-5 bg-gray-100 rounded-t-xl py-3 px-4 border-t border-l border-r font-mono items-center">
        <img width={35} height={35} src={`data:image/png;base64, ${data}`} />
        <div class="overflow-ellipsis w-52 overflow-hidden">{address}</div>
      </div>
      <img src={`https://donation-dapp.infura-ipfs.io/ipfs/${hash}`} />
      <div class="py-3 px-4 flex flex-col border-l border-r">
        <span class="font-sans font-bold">Description</span>
        <span class="font-sans pt-2">{description}</span>
      </div>
      <div class="bg-gray-100 rounded-b-xl py-3 px-4 border-b border-l border-r font-mono flex flex-row justify-between">
        <span>
          Total DONATIONS: {ethers.utils.formatEther(totalDonations)} MATIC
        </span>
        <div
          onClick={async () => {
            const donationAmount = ethers.utils.formatUnits(
              parseEther("0.1"),
              "wei"
            );
            await donateImageOwner(id, donationAmount);
            await updateImages();
          }}
        >
          <span class="cursor-pointer font-bold text-blue-400">
            DONATE: 0.1 MATIC
          </span>
        </div>
      </div>
    </div>
  );
};

export default BodyItem;
