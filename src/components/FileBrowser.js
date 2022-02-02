// import PropTypes from "prop-types";
import { Fragment} from "react";

const FileBrowser = ({ fileOnChange, fileNames, fileURLs }) => {
  return (
    <Fragment>
      <form>
        <div className="file">
          <input
            type="file"
            multiple
            accept="image/*"
            className="file"
            id="file"
            onChange={fileOnChange}
          />
        </div>
      </form>
    </Fragment>
  );
};

export default FileBrowser;
