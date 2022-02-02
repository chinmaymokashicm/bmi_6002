const Section = ({ header, component, footer, isExpanded, setExpanded, getCollapseProps, getToggleProps }) => {
  return (
    <div>
      <h1>{header}</h1>
      <button
        {...getToggleProps({
          onClick: () => setExpanded((prevExpanded) => !prevExpanded),
        })}
      >
        {isExpanded ? "⇑" : "⇓"}
    </button>
      <div {...getCollapseProps()}>
        {component} {footer}{" "}
      </div>
    </div>
  );
};

export default Section;
