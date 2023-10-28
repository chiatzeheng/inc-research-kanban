import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { Kanban } from "@/types";

import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import SearchBar from "./SearchBar";
import { defaultKanbans } from "./data";
import SearchBarModal from "./SearchBarModal";
interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const tailwindTextColors = [
  "text-red-400",
  "text-blue-400",
  "text-yellow-400",
  "text-green-400",
  "text-indigo-400",
  // ... you can add as many colors as you want
];
const participants = [
  {
    id: 1,
    name: "Wade Cooper",
  },
  {
    id: 2,
    name: "Arlene Mccoy",
  },
  {
    id: 3,
    name: "Devon Webb",
  },
  {
    id: 4,
    name: "Tom Cook",
  },
  {
    id: 5,
    name: "Ah Tan",
  },
  {
    id: 6,
    name: "Jeffery Davis",
  },
];

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  const [selectedKanban, setSelectedKanban] = useState<Kanban>(
    defaultKanbans[0]!,
  );
  const maxDisplay = 4; // adjust this value based on how many avatars you want to display before showing the remainder
  const toShow = participants.slice(0, maxDisplay);
  const remainder = participants.length - maxDisplay;

  //filtering results through search

  return (
    <div className="text- sticky top-0 z-40 flex items-center justify-between gap-x-6 bg-white px-11 px-4 py-4 shadow-sm sm:px-16">
      <div className="flex gap-8">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        {/* ListBox Start */}
        {/* <div className="flex-1 text-sm font-semibold leading-6 text-gray-900"></div> */}
        <div className="block">
          <Listbox value={selectedKanban} onChange={setSelectedKanban}>
            {({ open }) => (
              <>
                <Listbox.Label className="sr-only">
                  Change published status
                </Listbox.Label>
                <div className="relative">
                  <div className="divide-grey inline-flex divide-x rounded-md shadow-sm">
                    <div className="bg-white-600 text-grey inline-flex items-center gap-x-1.5 rounded-l-md px-3 py-2 shadow-sm">
                      <CheckIcon
                        className="-ml-0.5 h-5 w-5"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-semibold">
                        {selectedKanban.title}
                      </p>
                    </div>
                    <Listbox.Button className="bg-white-600 hover:bg-white-700 focus:ring-grey-300 inline-flex items-center rounded-l-none rounded-r-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50">
                      <span className="sr-only">Change published status</span>
                      <ChevronDownIcon
                        className="text-gray h-5 w-5"
                        aria-hidden="true"
                      />
                    </Listbox.Button>
                  </div>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {defaultKanbans.map((kanban) => (
                        <Listbox.Option
                          key={kanban.title}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-white-600 text-gray"
                                : "text-gray-900",
                              "cursor-pointer select-none p-4 text-sm hover:bg-gray-50",
                            )
                          }
                          value={kanban}
                        >
                          {({ selected, active }) => (
                            <div className="flex flex-col">
                              <div className="flex justify-between">
                                <p
                                  className={
                                    selected ? "font-semibold" : "font-normal"
                                  }
                                >
                                  {kanban.title}
                                </p>
                                {selected ? (
                                  <span
                                    className={
                                      active ? "text-gray" : "text-indigo-600"
                                    }
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
        {/* Listbox end */}
      </div>
      {/* participants section*/}
      <div className="relative flex w-36 items-center gap-1">
        {/* Display avatars for the participants */}
        {toShow.map((person, index) => (
          <div
            key={index}
            className="group relative z-10 flex items-center justify-center"
          >
            <UserCircleIcon
              className={`-mr-4 h-10 w-10 ${tailwindTextColors[index]} drop-shadow-sm`}
            />
            <span className="text-gray absolute bottom-[-25px] -mr-4 whitespace-nowrap rounded  py-1 text-xs opacity-0 drop-shadow-sm transition-opacity duration-300 group-hover:opacity-100">
              {person.name}
            </span>
          </div>
        ))}

        {/* Overlap the last avatar with the +remainder circle if there are more participants than maxDisplay */}
        {remainder > 0 && (
          <div className="absolute right-0 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
            +{remainder}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-32">
        <Link href="/">
          <span className="sr-only">Your profile</span>
          <img
            className="h-8 w-8 rounded-full bg-gray-50"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </Link>
      </div>
    </div>
  );
}
