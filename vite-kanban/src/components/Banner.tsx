import SearchBar from "./SearchBar";
import { UserButton } from "@clerk/clerk-react";

function Banner() {
  return (
    <div className="p-10 flex-wrap grid grid-flow-col justify-stretch">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">

          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            INC Research Kanban
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            A simple Kanban board for INC Research.
          </p>
        </div>
       <SearchBar />
      </div>

      <div className=" flex justify-center">
          <UserButton/>
      </div>
    </div>
  );
}

export default Banner;
