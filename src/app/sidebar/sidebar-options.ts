export interface SidebarLink {
  href: string;
  name: string;
  menu:string;
  children?: SidebarLink[];
}

export const SIDEBAR_LINKS = [
  
    {
      href: "/director",
      name: "Director Master",
      menu: "techMenu"
    },  
    {
      href: "/company",
      name: "Company Master",
      menu: "techMenu"
    },
    {
      href: "/document-genaration",
      name: "Document Master",
      menu: "techMenu"
    },  
    {
      href: "/auditor",
      name: "Auditor Master",
      menu: "techMenu"
    },
    { name: "Home", href: "/home", menu: "techMenu" },
    { name: "About", href: "/about" ,menu: "techMenu"},
    { 
      name: "Services", menu: "servicesMenu", children: [
        { name: "Web Development",menu: "techMenu", href: "/services/web" },
        { name: "App Development",menu: "techMenu", href: "/services/app" },
        { name: "SEO Services",menu: "techMenu", href: "/services/seo" },
      ]
    },
    { 
      name: "Categories", menu: "categoriesMenu", children: [
        { 
          name: "Technology", menu: "techMenu", children: [
            { name: "Angular",menu: "techMenu", href: "/categories/angular" },
            { name: "React", menu: "techMenu",href: "/categories/react" }
          ]
        },
        { name: "Business",menu: "techMenu", href: "/categories/business" },
      ]
    }
  ];

