import PostsBrowser from "./components/posts-browser";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16">
        <header>
          <h1 className="text-3xl font-bold text-black">
            Posts
          </h1>
        </header>
        <PostsBrowser />
      </main>
    </div>
  );
}
