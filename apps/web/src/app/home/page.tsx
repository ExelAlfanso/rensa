import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { homeMetadata } from "./metadata";

export const metadata: Metadata = homeMetadata;

export default function Home() {
  return <HomeClient></HomeClient>;
}
