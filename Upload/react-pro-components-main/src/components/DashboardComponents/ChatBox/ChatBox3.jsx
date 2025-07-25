import React from "react";

const ChatBox3 = () => {
  const pictures = [
    "https://cdn.tailgrids.com/2.0/image/dashboard/images/chat-box/chat-box-03/chat-01.jpg",
    "https://cdn.tailgrids.com/2.0/image/dashboard/images/chat-box/chat-box-03/chat-02.jpg",
  ];

  const active = false;

  return (
    <section className="bg-gray-2 py-20 dark:bg-dark lg:py-[120px]">
      <div className="mx-auto px-4 md:container">
        <div className="mx-auto w-full max-w-[550px] border border-stroke bg-white dark:border-dark-3 dark:bg-dark-2">
          <div className="flex items-center justify-between border-b border-stroke px-5 py-[18px] dark:border-dark-3 sm:px-[30px]">
            <div className="flex items-center">
              <div className="mr-4 h-[50px] w-full max-w-[50px] overflow-hidden rounded-full">
                <img
                  src="https://cdn.tailgrids.com/2.0/image/dashboard/images/chat-box/chat-box-03/image-01.jpg"
                  alt="avatar"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div>
                <h5 className="text-base font-medium text-dark dark:text-white">
                  Robert Henry
                </h5>
                <p className="text-sm text-body-color dark:text-dark-6">
                  <span
                    className={`mr-[6px] inline-block h-2 w-2 rounded-full ${
                      active ? "bg-green" : "bg-red"
                    }`}
                  ></span>
                  {active ? "Active" : "last seen 1h ago"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <img
                src="https://cdn.tailgrids.com/2.0/image/dashboard/images/chat-box/chat-box-03/image-02.jpg"
                alt="avatar"
                className="h-8 w-8 rounded-full border-2 border-white object-cover object-center dark:border-dark-3"
              />
              <img
                src="https://cdn.tailgrids.com/2.0/image/dashboard/images/chat-box/chat-box-03/image-03.jpg"
                alt="avatar"
                className="-ml-[10px] h-8 w-8 rounded-full border-2 border-white object-cover object-center dark:border-dark-3"
              />
              <img
                src="https://cdn.tailgrids.com/2.0/image/dashboard/images/chat-box/chat-box-03/image-04.jpg"
                alt="avatar"
                className="-ml-[10px] h-8 w-8 rounded-full border-2 border-white object-cover object-center dark:border-dark-3"
              />
              <span className="-ml-[10px] inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-medium text-white dark:border-dark-3">
                03
              </span>
            </div>
          </div>

          <div className="px-5 py-[30px] sm:px-[30px]">
            <div className="mb-9 space-y-6">
              <Chat
                img="https://cdn.tailgrids.com/2.0/image/dashboard/images/chat-box/chat-box-03/image-01.jpg"
                name="Nagita salavina"
                time="1d"
                text="Hi, are we going on new year's holiday? we can visite india."
              />
              <Chat
                img="https://cdn.tailgrids.com/2.0/image/dashboard/images/chat-box/chat-box-03/image-01.jpg"
                name="Nagita salavina"
                time="1d"
                audio="/#"
                pictures={pictures}
              />
              <Reply
                name="You"
                time="10mins"
                text="Wow, that's an interesting place"
                img="https://cdn.tailgrids.com/2.0/image/dashboard/images/chat-box/chat-box-03/image-01.jpg"
              />

              <form className="relative">
                <input
                  type="text"
                  placeholder="Type something here..."
                  className="h-[58px] w-full rounded-lg border border-stroke bg-gray-1 pl-4 pr-[135px] text-base text-body-color outline-hidden focus:border-primary dark:border-dark-3 dark:bg-transparent dark:text-dark-6 sm:pl-6"
                />

                <div className="absolute right-4 top-1/2 inline-flex -translate-y-1/2 items-center justify-end">
                  <button className="mr-[14px] text-body-color hover:text-primary dark:text-dark-6">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path d="M9 10.6594C10.7438 10.6594 12.1781 9.22497 12.1781 7.48123V3.68435C12.1781 1.9406 10.7438 0.506226 9 0.506226C7.25625 0.506226 5.82188 1.9406 5.82188 3.68435V7.48123C5.82188 9.22497 7.25625 10.6594 9 10.6594ZM7.0875 3.68435C7.0875 2.6156 7.95938 1.77185 9 1.77185C10.0688 1.77185 10.9125 2.64373 10.9125 3.68435V7.48123C10.9125 8.54998 10.0406 9.39373 9 9.39373C7.93125 9.39373 7.0875 8.52185 7.0875 7.48123V3.68435V3.68435Z" />
                      <path d="M14.3438 7.62184C14.3438 7.28434 14.0625 6.97496 13.6969 6.97496C13.3313 6.97496 13.05 7.25621 13.05 7.62184C13.0781 9.84371 11.25 11.6437 9 11.6437C6.75 11.6437 4.92188 9.84371 4.92188 7.59371C4.92188 7.25621 4.64063 6.94684 4.275 6.94684C3.90938 6.94684 3.62813 7.22809 3.62813 7.59371C3.62813 10.2937 5.68125 12.5437 8.325 12.8531V16.875C8.325 17.2125 8.60625 17.5218 8.97188 17.5218C9.30938 17.5218 9.61875 17.2406 9.61875 16.875V12.8812C12.2906 12.5718 14.3438 10.3218 14.3438 7.62184Z" />
                    </svg>
                  </button>
                  <button className="mr-[18px] text-body-color hover:text-primary dark:text-dark-6">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path d="M9.225 17.5219C9.16875 17.5219 9.14062 17.5219 9.08437 17.5219C7.79062 17.5219 6.38438 16.9875 5.5125 16.1719C4.58438 15.3 4.07812 14.1188 4.07812 12.9094V4.19063C4.07812 2.98126 4.66875 1.88438 5.70937 1.18126C6.72187 0.478134 7.9875 0.309384 9.16875 0.731259L9.225 0.759384C9.36562 0.815634 9.53438 0.843759 9.70312 0.956259C10.9969 1.63126 11.7844 2.84063 11.7844 4.21876V11.6719C11.7844 12.4313 11.5312 13.1344 11.0531 13.6969C10.9688 13.8094 10.9125 13.8656 10.8562 13.8938C10.3219 14.3719 9.70312 14.625 9 14.625C8.2125 14.625 7.45313 14.2594 6.94688 13.6688C6.46875 13.1063 6.1875 12.375 6.1875 11.6156V5.40001C6.1875 5.06251 6.46875 4.75313 6.83437 4.75313C7.2 4.75313 7.48125 5.03438 7.48125 5.40001V11.6438C7.48125 12.0938 7.65 12.5438 7.93125 12.8813C8.18438 13.1906 8.60625 13.3875 9 13.3875C9.36562 13.3875 9.675 13.2469 9.95625 12.9938C9.98438 12.9656 10.0125 12.9375 10.0687 12.8813C10.35 12.5438 10.5188 12.1219 10.5188 11.6719V4.19063C10.5188 3.29063 10.0125 2.50313 9.1125 2.05313L9.08437 2.02501C9.02812 1.99688 8.97188 1.96876 8.85938 1.94063L8.775 1.91251C7.95938 1.63126 7.11562 1.74376 6.4125 2.22188C5.70937 2.67188 5.34375 3.37501 5.34375 4.16251V12.8813C5.34375 13.725 5.7375 14.5969 6.38438 15.2156C7.03125 15.8063 8.12813 16.2281 9.1125 16.2281C10.0688 16.2563 10.9688 15.8906 11.6719 15.2438C12.3469 14.5969 12.7125 13.7531 12.6844 12.8813V6.10313C12.6844 5.76563 12.9656 5.45626 13.3313 5.45626C13.6969 5.45626 13.9781 5.73751 13.9781 6.10313V12.8813C14.0063 14.0906 13.5 15.2719 12.5719 16.1719C11.6438 17.0156 10.4344 17.5219 9.225 17.5219Z" />
                    </svg>
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary hover:bg-blue-dark">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_1061_11601)">
                        <path
                          d="M14.8999 7.42497C14.7999 7.24997 14.6499 7.12497 14.4749 7.02497L2.94994 0.574974C2.74994 0.474974 2.52494 0.424974 2.29994 0.449974C2.07494 0.474974 1.87494 0.549974 1.69994 0.699974C1.52494 0.849974 1.39994 1.04997 1.34994 1.24997C1.27494 1.47497 1.29994 1.69997 1.37494 1.92497L3.52494 7.99997L1.37494 14.075C1.29994 14.3 1.29994 14.525 1.34994 14.725C1.39994 14.95 1.52494 15.125 1.69994 15.275C1.87494 15.425 2.07494 15.5 2.29994 15.525C2.32494 15.525 2.37494 15.525 2.39994 15.525C2.57494 15.525 2.77494 15.475 2.94994 15.375L14.4749 8.92497C14.6499 8.82497 14.7999 8.69997 14.8999 8.52497C14.9999 8.34997 15.0499 8.14997 15.0499 7.97497C15.0499 7.79997 14.9999 7.59997 14.8999 7.42497ZM2.44994 1.57497L12.8999 7.42497H4.52494L2.44994 1.57497ZM2.44994 14.425L4.54994 8.57497H12.9249L2.44994 14.425Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1061_11601">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatBox3;

const Chat = ({ img, name, time, text, audio, pictures }) => {
  return (
    <div className="flex w-full max-w-[380px]">
      <div className="mr-[14px] h-10 w-full max-w-[40px] rounded-full">
        <img
          src={img}
          alt="avatar"
          className="h-full w-full rounded-full object-cover object-center"
        />
      </div>

      <div>
        <p className="mb-[10px] text-base font-medium text-dark dark:text-white">
          <span>{name}</span>
          <span className="pl-[10px] text-sm text-body-color dark:text-dark-6">
            {" "}
            {time}{" "}
          </span>
        </p>

        {text && (
          <div className="inline-block rounded-[20px] rounded-tl-none bg-[#F6F5F8] px-4 py-2 dark:bg-dark-3">
            <p className="text-base text-dark dark:text-white">{text}</p>
          </div>
        )}
        {audio && (
          <audio controls className="mb-4">
            <source src={audio} />
            Your browser does not support the audio element.
          </audio>
        )}
        {pictures && (
          <div className="flex flex-wrap items-center gap-2">
            {pictures.map((picture, index) => {
              return (
                <img
                  key={index}
                  src={picture}
                  alt="chat box image"
                  className="max-w-full rounded-lg object-cover object-center"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const Reply = ({ name, img, time, text }) => {
  return (
    <div className="ml-auto flex w-full max-w-[380px] justify-end">
      <div>
        <p className="mb-[10px] text-right text-base font-medium text-dark dark:text-white">
          <span>{name}</span>
          <span className="pl-[10px] text-sm text-body-color dark:text-dark-6">
            {time}
          </span>
        </p>

        <div className="inline-block rounded-[20px] rounded-tr-none bg-primary px-4 py-2">
          <p className="text-base text-white">{text}</p>
        </div>
      </div>

      <div className="ml-[14px] h-10 w-full max-w-[40px] rounded-full">
        <img
          src={img}
          alt="avatar"
          className="h-full w-full rounded-full object-cover object-center"
        />
      </div>
    </div>
  );
};
