import { Component, createSignal } from "solid-js";
import Body from "./components/Body";
import { useData } from "./context/DataContext";

const App: Component = () => {
  let [isOpen, setIsOpen] = createSignal(false);
  const { loading } = useData();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div class="flex flex-col items-center justify-start min-h-screen py-2">
      {/* <UploadImage isOpen={isOpen()} closeModal={closeModal} />
       <Header /> */}
      <div
        class="max-w-2xl w-full bg-blue-100 rounded-xl flex justify-center items-center py-2 mt-3 hover:bg-blue-200 cursor-pointer"
        onClick={openModal}
      >
        <span class="text-blue-500 font-bold text-lg">Upload Image</span>
      </div>
      {loading ? (
        <div class="font-bold text-gray-400 mt-36 text-4xl">Loading...</div>
      ) : (
        <Body />
      )}
    </div>
  );
};

export default App;
