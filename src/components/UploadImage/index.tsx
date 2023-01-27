import { create } from "ipfs-http-client";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  Transition,
  TransitionChild,
} from "solid-headless";
import { Component, createSignal } from "solid-js";
import DataRoot from "../../context/DataRoot";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

export const UploadImage: Component<Props> = ({ isOpen, closeModal }) => {
  const { contract, account, updateImages } = DataRoot;
  const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });
  const [buttonTxt, setButtonTxt] = createSignal<string>("Upload");
  const [file, setFile] = createSignal<File | null>(null);
  const [description, setDescription] = createSignal<string>("");

  const uploadImage = async () => {
    setButtonTxt("Uploading to IPFS...");
    const added = await client.add(file());
    setButtonTxt("Creating smart contract...");
    contract()
      .methods.uploadImage(added.path, description())
      .send({ from: account() })
      .then(async () => {
        await updateImages();
        setFile(null);
        setDescription("");
        setButtonTxt("Upload");
        closeModal();
      })
      .catch(() => {
        closeModal();
      });
  };

  return (
    <>
      <Transition appear show={isOpen}>
        <Dialog
          isOpen
          class="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <DialogOverlay class="fixed inset-0 bg-black opacity-40" />

          <div class="min-h-screen px-4 text-center ">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogOverlay class="fixed inset-0" />
            </TransitionChild>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span class="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div class="inline-block w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl max-w-xl">
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  Upload Image to IPFS
                </DialogTitle>
                <div class="mt-2">
                  <input
                    onchange={(e) => setFile(e.currentTarget.files[0])}
                    class="my-3"
                    type="file"
                  />
                </div>

                {file && (
                  <div class="mt-2">
                    <img src={URL.createObjectURL(file())} />
                  </div>
                )}

                <div class="mt-4">
                  <textarea
                    onchange={(e) => {
                      setDescription(e.currentTarget.value);
                    }}
                    value={description()}
                    placeholder="Description"
                    class="px-3 py-1 font-sourceSansPro text-lg bg-gray-100 hover:bg-white focus:bg-white rounded-lg border-4 hover:border-4 border-transparent hover:border-green-200 focus:border-green-200 outline-none focus:outline-none focus:ring w-full pr-10 transition-all duration-500 ring-transparent"
                  />
                </div>
                <div class="mt-4">
                  <button
                    type="button"
                    disabled={buttonTxt() !== "Upload"}
                    class="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onclick={() => {
                      if (file()) uploadImage();
                    }}
                  >
                    {buttonTxt()}
                  </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
