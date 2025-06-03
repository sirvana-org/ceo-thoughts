import { Plus_Jakarta_Sans } from "next/font/google";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import fs from "fs";
import path from "path";
import { Tweet } from "react-tweet";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

const markdownFilePath = path.join(process.cwd(), "markdown", "text.md");
const markdownContent = fs.readFileSync(markdownFilePath, "utf8");

export default function Home() {
  return (
    <main
      className={`${plusJakartaSans.className} min-h-screen bg-white relative w-full overflow-hidden`}
    >
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center pt-10 pb-4 gap-12">
        {/* Centered Logo */}
        <img
          src="/assets/logoLarge.svg"
          alt="Melian Logo"
          className="w-40 sm:w-48 md:w-72 lg:w-80 h-auto mb-6"
        />

        {/* Horizontal product strip */}
        <div className="w-full overflow-hidden mb-12">
          <img
            src="/assets/products.png"
            alt="Product showcase"
            className="w-full h-auto object-contain scale-110 md:scale-100"
          />
        </div>
      </section>

      <div className="w-screen md:max-w-4xl mx-auto px-6 py-12">
        <article className="prose prose-lg prose-gray max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold mb-6 text-gray-900">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-800">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => <pre className="mb-4">{children}</pre>,
              ul: ({ children }) => (
                <ul className="mb-4 pl-6 space-y-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-4 pl-6 space-y-2">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-gray-700">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <table className="w-full border-collapse border border-gray-300 my-4">
                  {children}
                </table>
              ),
              th: ({ children }) => (
                <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-300 px-4 py-2">{children}</td>
              ),
              a: ({ children, href }) => {
                const hrefStr = href as string;
                // Detect Twitter/X status links and embed them
                const tweetMatch = hrefStr.match(
                  /^https?:\/\/(?:twitter\.com|x\.com)\/[^/]+\/status\/([0-9]+)/i
                );
                if (tweetMatch) {
                  const tweetId = tweetMatch[1];
                  return (
                    <div className="my-6 flex justify-center max-h-[70vh]">
                      <Tweet id={tweetId} />
                    </div>
                  );
                }
                // Existing video fallback
                if (/\.(mp4|webm|ogg)$/i.test(hrefStr)) {
                  return (
                    <video
                      src={hrefStr}
                      controls
                      autoPlay
                      loop
                      className="mx-auto max-h-[70vh] max-w-full object-contain shadow-none outline-none focus:outline-none focus:shadow-none"
                    ></video>
                  );
                }
                // Default link rendering
                return (
                  <a
                    href={hrefStr}
                    className="text-blue-600 hover:text-blue-800 underline truncate max-w-2/4"
                  >
                    {children}
                  </a>
                );
              },
              hr: () => <hr className="my-8 border-gray-300" />,
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900">
                  {children}
                </strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
              img: ({ src, alt }) => {
                const srcStr = src as string;
                if (/\.(mp4|webm|ogg)$/i.test(srcStr)) {
                  return (
                    <video
                      src={srcStr}
                      controls
                      autoPlay
                      loop
                      className="mx-auto max-h-[70vh] max-w-full object-contain shadow-none outline-none focus:outline-none focus:shadow-none"
                    ></video>
                  );
                }
                return (
                  <img
                    src={srcStr}
                    alt={typeof alt === "string" ? alt : "image"}
                    className="mx-auto max-h-[70vh] max-w-full object-contain"
                  />
                );
              },
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </article>

        {/* Mobile App Download Section - Inline below content */}
        <div className="block min-w-[1200px]:hidden mt-8">
          <a
            href="https://apps.apple.com/us/app/melian/id6738385324"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/80 text-gray-900 rounded-2xl block w-full "
          >
            {/* Header with logo */}
            <div className="flex items-center space-x-2 mb-2">
              <img
                src="/assets/logoSmall.png"
                alt="Melian Logo"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-2xl font-semibold">Get the App</div>
            </div>

            {/* Description */}
            <div className="text-md text-gray-600 mb-3">
              Effortless shopping
            </div>

            {/* App Store Badge */}
            <div>
              <img
                src="/assets/appStoreBlack.svg"
                alt="Download on the App Store"
                className="h-8 w-auto"
              />
            </div>
          </a>
        </div>
      </div>

      {/* Floating Download Button - Desktop only */}
      <div className="hidden min-w-[1200px]:block fixed bottom-6 left-6 z-50">
        <a
          href="https://apps.apple.com/us/app/melian/id6738385324"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/80 backdrop-blur-md text-gray-900 rounded-2xl block w-full"
        >
          {/* Header with logo */}
          <div className="flex items-center space-x-2 mb-2">
            <img
              src="/assets/logoSmall.png"
              alt="Melian Logo"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-2xl font-semibold">Get the App</div>
          </div>

          {/* Description */}
          <div className="text-md text-gray-600 mb-3">Effortless shopping</div>

          {/* App Store Badge */}
          <div>
            <img
              src="/assets/appStoreBlack.svg"
              alt="Download on the App Store"
              className="h-8 w-auto"
            />
          </div>
        </a>
      </div>
    </main>
  );
}
