"use client";

import { useEffect, useMemo, useState } from "react";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";
const DEBOUNCE_MS = 300;

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export default function PostsBrowser() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetch(POSTS_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data: Post[]) => {
        setPosts(data);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((post) => post.title.toLowerCase().includes(query));
  }, [posts, debouncedSearch]);

  const selectedPost =
    posts.find((post) => post.id === selectedId) ?? null;

  if (loading) {
    return (
      <p>Loading posts…</p>
    );
  }

  if (error) {
    return (
      <p>
        Failed to load posts: {error}
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <label htmlFor="post-search" className="sr-only">
          Search posts by title
        </label>
        <input
          id="post-search"
          type="search"
          placeholder="Search by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-white px-4 py-2 text-sm"
        />
      </div>

      <div className="grid min-h-[420px] gap-6 lg:grid-cols-2">
        <section className="flex flex-col overflow-hidden rounded-lg border border-gray-200">
          <h2 className="border-b border-gray-200 px-4 py-3 text-sm font-medium">
            Posts ({filteredPosts.length})
          </h2>
          <ul className="max-h-[480px] overflow-y-auto">
            {filteredPosts.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm">
                No posts match &ldquo;{debouncedSearch}&rdquo;
              </li>
            ) : (
              filteredPosts.map((post) => (
                <li key={post.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(post.id)}
                    className={`w-full border-b border-gray-200 px-4 py-3 text-left text-sm hover:bg-gray-50 ${selectedId === post.id
                      ? "bg-gray-100"
                      : ""
                      }`}
                  >
                    <span className=" text-xs">
                      #{post.id}
                    </span>
                    <span className="mt-0.5 block line-clamp-2">
                      {post.title}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="flex flex-col overflow-hidden rounded-lg border border-gray-200">
          <h2 className="border-b border-gray-200 px-4 py-3 text-sm font-medium">
            Post details
          </h2>
          {selectedPost ? (
            <dl className="space-y-4 overflow-y-auto p-4 text-sm">
              <div>
                <dt className="text-xs font-bold">
                  ID
                </dt>
                <dd className="mt-1">{selectedPost.id}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold">
                  User ID
                </dt>
                <dd className="mt-1">{selectedPost.userId}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold">
                  Title
                </dt>
                <dd className="mt-1">{selectedPost.title}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold">
                  Body
                </dt>
                <dd className="mt-1 whitespace-pre-wrap">
                  {selectedPost.body}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="p-4 text-sm">
              Select a post from the list
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
