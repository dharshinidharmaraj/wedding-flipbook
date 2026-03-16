import React from "react";

interface CoverPageProps {
  title: string;
}

const CoverPage = React.forwardRef<HTMLDivElement, CoverPageProps>(
  ({ title }, ref) => {
    return (
      <div ref={ref}>
        <h1>{title}</h1>
      </div>
    );
  }
);

export default CoverPage;