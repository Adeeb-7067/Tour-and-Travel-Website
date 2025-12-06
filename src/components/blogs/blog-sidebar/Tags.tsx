// components/blog-sidebar/Tags.tsx

interface TagsProps {
  tags: string[];
}

const Tags = ({ tags }: TagsProps) => {
  return (
    <div className="tg-blog-sidebar-tag tg-blog-sidebar-box">
      <h5 className="tg-blog-sidebar-title mb-25">Tags</h5>
      <div className="tg-blog-sidebar-tag-list">
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {tags.map((tag, i) => (
            <li
              key={i}
              style={{
                backgroundColor: "#f4edff",
                color: "#6a0dad",
                fontWeight: 500,
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "16px",
                textAlign: "center",
                cursor: "default",
                transition: "all 0.3s ease",
              }}
            >
              <span>{tag}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tags;
