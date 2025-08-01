declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
