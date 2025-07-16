import GiftIcon from "@/assets/icons/gift.svg?react";
import HomeIcon from "@/assets/icons/home.svg?react";
import PersonIcon from "@/assets/icons/person.svg?react";

const icons = {
  Home: HomeIcon,
  Gift: GiftIcon,
  Person: PersonIcon,
};

export default {
  title: "Foundations/Icons",
};

export const Icons = () => (
  <div className="flex flex-col gap-16 p-8">
    <section>
      <h1 className="mb-6 font-bold text-3xl text-gray-800">
        너구디 Icon Library
      </h1>

      <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        {Object.entries(icons).map(([name, Icon]) => (
          <div
            key={name}
            className="flex flex-col items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4"
          >
            <Icon width={24} height={24} />
            <code className="break-words text-center text-gray-600">
              {name}Icon
            </code>
          </div>
        ))}
      </div>
    </section>
  </div>
);
