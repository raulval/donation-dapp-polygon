import { Component, For } from "solid-js";
import { useData } from "../../context/DataContext";
import BodyItem from "./BodyItem";

const Body: Component = () => {
  const { images } = useData();
  return (
    <>
      {
        images && images.length > 0 && (
          <For
            each={images()}
            fallback={
              <div class="font-bold text-gray-400 mt-36 text-4xl">
                Loading...
              </div>
            }
          >
            {(image) => (
              <BodyItem
                totalDonations={image.donationAmount}
                address={image.author}
                description={image.description}
                hash={image.hash}
                id={image.id}
              />
            )}
          </For>
        )
        // images().map((image, index) => (
        //   <BodyItem
        //     key={index}
        //     totalDonations={image.donationAmount}
        //     address={image.author}
        //     description={image.description}
        //     hash={image.hash}
        //     id={image.id}
        //   />
        // ))
      }
    </>
  );
};

export default Body;
