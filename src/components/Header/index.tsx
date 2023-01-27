import Identicon from "identicon.js";
import { createEffect, createSignal } from "solid-js";
import DataRoot from "../../context/DataRoot";

function Header() {
  const { account } = DataRoot;
  const [data, setData] = createSignal<any>();

  createEffect(() => {
    if (account() !== "0x0") {
      setData(new Identicon(account(), 200).toString());
    }
  });

  return (
    <div class="container items-center">
      <div class="flex flex-col md:flex-row items-center md:justify-between border py-3 px-5 rounded-xl">
        <span class="font-mono">Polygon MATIC</span>
        <div class="flex flex-row space-x-2 items-center">
          <div class="h-5 w-5 rounded-full bg-blue-500"></div>
          <span class="font-mono text-xl font-bold">Decentagram</span>
        </div>
        <div class="flex flex-row space-x-2 items-center">
          <span class="font-mono overflow-ellipsis w-24 overflow-hidden">
            {account()}
          </span>
          {account() && data() && (
            <img
              width={35}
              height={35}
              src={`data:image/png;base64, ${data()}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
