type SidebarLink = {
  imgURL: string;
  route: string;
  label: string;
};

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/icons/book.svg",
    route: "/books",
    label: "Books",
  },
  {
    imgURL: "/icons/author.svg",
    route: "/authors",
    label: "Authors",
  },
  {
    imgURL: "/icons/favorite.svg",
    route: "/my-favorites",
    label: "Favorites",
  },
  {
    imgURL: "/icons/wishlist.svg",
    route: "/my-wishlist",
    label: "Wishlist",
  },
];

export const filterOptions = {
  rating: [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
  ],
  books: [
    { value: "1+", label: "1+" },
    { value: "2+", label: "2+" },
    { value: "3+", label: "3+" },
    { value: "4+", label: "4+" },
    { value: "5+", label: "5+" },
  ],
};
