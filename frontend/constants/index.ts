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
    imgURL: "/icons/favorite.svg",
    route: "/my-favorites",
    label: "Favorites",
  },
  {
    imgURL: "/icons/wishlist.svg",
    route: "/my-wishlist",
    label: "Wishlist",
  },
  {
    imgURL: "/icons/author.svg",
    route: "/authors",
    label: "Authors",
  },
];
