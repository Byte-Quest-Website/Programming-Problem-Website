import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

import React from "react";

const Markdown = (props: { markdown: string }) => {
    return (
        <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            remarkPlugins={[remarkGfm]}
        >
            {props.markdown}
        </ReactMarkdown>
    );
};

export default Markdown;
