import * as React from "react";
import { useInfiniteQuery } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import "./styles.css";

interface HNItem {
  id: number;
  title?: string;
  text?: string;
  type?: string;
  time?: number;
}

async function getItems(key: string, index: number = 1) {
  console.log(index);
  const results = await Promise.all(
    Array(5)
      .fill(0)
      .map(async (_, i) => {
        const result = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${index + i}.json`
        );
        const json = await result.json();
        return json as HNItem;
      })
  );
  return results;
}

export default function App() {
  const items = useInfiniteQuery("items", getItems, {
    getFetchMore: (currentPage, allPages) => {
      return (
        currentPage.length > 0 && currentPage[currentPage.length - 1].id + 1
      );
    }
  });

  if (items.isLoading) return "Loading";
  if (items.isError) return "Error";
  return (
    <div>
      <ReactQueryDevtools initialIsOpen={false} />
      <button
        disabled={!items.canFetchMore || items.isFetching}
        onClick={() => items.fetchMore()}
      >
        Fetch more
      </button>
      <ul>
        {items.data?.map((group) => {
          return group.map((item) => {
            return (
              <li key={item.id}>
                {new Date(item.time!).toDateString()} - {item.title}
              </li>
            );
          });
        })}
      </ul>
    </div>
  );
}
