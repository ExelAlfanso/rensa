import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "./react-swagger";

export default async function IndexPage() {
	const spec = await getApiDocs();
	return (
		<section className="w-full min-h-screen p-0 m-0 bg-white">
			<ReactSwagger spec={spec} />
		</section>
	);
}
