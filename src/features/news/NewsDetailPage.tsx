import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/shared/components/atoms/back-button/BackButton";
import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { get } from "lodash";
import { useParams } from "react-router-dom";
import { getNewsById } from "./api/news";

const NewsDetailPage = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["news-item", id],
    queryFn: () => getNewsById(id),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError)
    return (
      <ErrorMessage
        title="Failed to Load page"
        message="An error occurred while loading the page. Please try again later."
      />
    );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xl font-semibold">{get(data, "name")}</div>
        <div className="flex gap-2">
          <BackButton
            to={"/dashboard/news-and-announcement"}
            label="Back to news"
          />
        </div>
      </div>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <CardTitle>{data?.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="text-sm text-primary font-extrabold">
              Number of students
            </div>
            <div className="text-sm text-muted-foreground">
              {data?.students_count}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="text-sm text-primary font-extrabold">Status:</div>
            {data?.is_active === true ? (
              <Badge variant="success">Active</Badge>
            ) : (
              <Badge variant="destructive">Inactive</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsDetailPage;
