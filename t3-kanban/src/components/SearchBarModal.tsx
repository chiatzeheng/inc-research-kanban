import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

interface SearchBarModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
}

export default function SearchBarModal({
  open,
  setOpen,
  query,
  setQuery,
}: SearchBarModalProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="overflow-y-none fixed inset-0 z-10 w-screen">
          <div className="flex min-h-full justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative top-60 transform overflow-hidden rounded-lg transition-all sm:top-[-20] sm:w-full sm:max-w-sm sm:p-6">
                <div className=" w-[550px] shadow-xl">
                  <input
                    type="text"
                    name="searchKanban"
                    id="searchKanban"
                    className=" focus: h-12 w-full rounded-md border-0 p-4 py-1.5  text-gray-900 shadow-md outline-none ring-0 placeholder:text-gray-400 focus:border-0 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
