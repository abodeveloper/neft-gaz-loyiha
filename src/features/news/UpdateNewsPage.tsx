import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getNewsById } from "./api/news";
import NewsForm from "./components/NewForm";

const UpdateNewsPage = () => {
  const { id } = useParams<{ id: string }>();
  const newsId = parseInt(id || "0", 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["news", newsId],
    queryFn: () => getNewsById(newsId),
    enabled: !!newsId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading news item</div>;

  return <NewsForm mode="update" id={newsId} initialData={data} />;
};

export default UpdateNewsPage;
