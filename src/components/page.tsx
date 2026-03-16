import React from "react"

type PageProps = {
  image: string
  number: number
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ image, number }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
          background: "white",
          position: "relative"
        }}
      >
        <img
          src={image}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "15px",
            fontSize: "14px",
            color: "#555"
          }}
        >
          {number}
        </div>
      </div>
    )
  }
)

export default Page