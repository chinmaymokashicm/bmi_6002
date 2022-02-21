const Section = ({
  header,
  component,
  footer,
  isExpanded,
  setExpanded,
  getCollapseProps,
  getToggleProps,
}) => {
  function onClick() {
    setExpanded((prevExpanded) => !prevExpanded);
  }

  return (
    <div className="section-main">
      <div
        className="section-header"
        {...getToggleProps({
          onClick: onClick,
        })}
      >
        <h1>{header}</h1>
      </div>
      {/* <button
        {...getToggleProps({
          onClick: onClick,
        })}
      >
        {isExpanded ? "⇑" : "⇓"}
      </button> */}
      <div {...getCollapseProps()}>
        <div className="section-component">{component}</div>
        <div className="section-footer">{footer}</div>
      </div>
    </div>
  );
};

export default Section;
