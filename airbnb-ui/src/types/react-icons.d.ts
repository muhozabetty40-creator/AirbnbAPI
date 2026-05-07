import { ComponentType, SVGAttributes } from "react";

export interface IconBaseProps extends SVGAttributes<SVGElement> {
  size?: string | number;
  color?: string;
  title?: string;
}

export type IconType = ComponentType<IconBaseProps>;

declare module "react-icons/ai" {
  export const AiOutlineHeart: IconType;
  export const AiFillHeart: IconType;
  [key: string]: IconType;
}

declare module "react-icons/bi" {
  export const BiUserPlus: IconType;
  [key: string]: IconType;
}

declare module "react-icons/bs" {
  export const BsMoon: IconType;
  export const BsSun: IconType;
  [key: string]: IconType;
}

declare module "react-icons/io5" {
  export const IoAddOutline: IconType;
  [key: string]: IconType;
}

declare module "react-icons/*" {
  const icons: { [key: string]: IconType };
  export = icons;
}
