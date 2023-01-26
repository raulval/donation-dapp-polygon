declare let window: any;
import { ethers } from "ethers";
import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  useContext,
} from "solid-js";
import DonationContract from "../abis/DonationContract.json";

interface DataContextProps {
  account: Accessor<string>;
  contract: Accessor<any>;
  loading: Accessor<boolean>;
  images: Accessor<any[]>;
  imageCount: Accessor<number>;
  updateImages: () => Promise<void>;
  donateImageOwner: (id: string, donateAmout: any) => Promise<void>;
}

const DataContext = createContext<DataContextProps>({} as DataContextProps);

export const DataProvider = ({ children }) => {
  const data = useProviderData();
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => useContext<DataContextProps>(DataContext);

export const useProviderData = () => {
  const [loading, setLoading] = createSignal(true);
  const [images, setImages] = createSignal([]);
  const [imageCount, setImageCount] = createSignal(0);
  const [account, setAccount] = createSignal("0x0");
  const [contract, setContract] = createSignal<any>();

  createEffect(() => {
    loadWeb3();
    loadBlockchainData();
  });

  const loadWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
    } else {
      window.alert("Non-Eth browser detected. Please consider using MetaMask.");
    }
  };

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const allAccounts = await provider.listAccounts();
    setAccount(allAccounts[0]);

    const networkId = (await provider.getNetwork()).chainId.toString();
    const networkData = DonationContract.networks[networkId];

    console.log("networkData", networkData);
    console.log("networkId", networkId);

    if (networkData) {
      const tempContract = new ethers.Contract(
        networkData.address,
        DonationContract.abi
      );
      setContract(tempContract);

      const count = await tempContract.imageCount();
      setImageCount(count);

      const tempImageList = [];
      for (let i = 1; i <= count; i++) {
        const image = await tempContract.images(i);
        tempImageList.push(image);
      }
      tempImageList.reverse();
      setImages(tempImageList);
    } else {
      window.alert("TestNet not found");
    }
    setLoading(false);
  };

  const updateImages = async () => {
    setLoading(true);
    if (contract() !== undefined) {
      const count = await contract().imageCount();
      setImageCount(count);
      const tempImageList = [];
      for (let i = 1; i <= count; i++) {
        const image = await contract().images(i);
        tempImageList.push(image);
      }
      tempImageList.reverse();
      setImages(tempImageList);
      setLoading(false);
    }
  };

  const donateImageOwner = async (id: string, donateAmout: any) => {
    const res = await contract().donateImageOwner(id, {
      from: account(),
      value: donateAmout,
    });
  };

  return {
    account,
    contract,
    loading,
    images,
    imageCount,
    updateImages,
    donateImageOwner,
  };
};
