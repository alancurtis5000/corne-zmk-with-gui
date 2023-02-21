import React, { useContext } from "react";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import "./bottom-actions.styles.scss";
import { DownloadButton } from "../download-button/download-button";
import { LayoutContext } from "../../providers/layout/layout.provider";
import { useLocation } from "react-router-dom";
import { Base64 } from "js-base64";
import { Octokit } from "@octokit/rest";
import { generateBlob } from "../download-button/blob-content";
import JSZip from "jszip";

export const BottomActions = () => {
  const {
    saveLayout,
    layout: { layers },
  } = useContext(LayoutContext);
  const location = useLocation();

  const handleSave = () => {
    saveLayout();
  };

  const commitToGitHub = async () => {
    try {
      // log into github
      const octokit = new Octokit({
        auth: process.env.REACT_APP_GITHUB_TOKEN,
      });

      // this is the context to commit
      const content = Base64.encode(generateBlob(layers));

      // get SHA of file you want to write over
      async function getSHA(path) {
        const result = await octokit.repos.getContent({
          owner: process.env.REACT_APP_GITHUB_OWNER,
          repo: process.env.REACT_APP_GITHUB_REPO,
          path,
        });

        const sha = result?.data?.sha;

        return sha;
      }

      // commit the code
      async function commitArticle(article) {
        const path = "config/corne.keymap";
        const sha = await getSHA(path);

        const result = await octokit.repos.createOrUpdateFileContents({
          owner: process.env.REACT_APP_GITHUB_OWNER,
          repo: process.env.REACT_APP_GITHUB_REPO,
          path,
          message: `updated config from gui`,
          content: article,
          sha,
        });

        return result?.status || 500;
      }

      await commitArticle(content);
    } catch (error) {}
  };

  const getArtifact = async () => {
    // alan todo : how to download artifact
    // still need to work this out

    // log into github
    const octokit = new Octokit({
      auth: process.env.REACT_APP_GITHUB_TOKEN,
    });

    const resp = await octokit.request(
      `GET /repos/{owner}/{repo}/actions/artifacts`,
      {
        owner: process.env.REACT_APP_GITHUB_OWNER,
        repo: process.env.REACT_APP_GITHUB_REPO,
      }
    );
    const artifactId = resp.data.artifacts[0].id;
    console.log({ resp, artifactId });
    await octokit.request(
      "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}",
      {
        owner: process.env.REACT_APP_GITHUB_OWNER,
        repo: process.env.REACT_APP_GITHUB_REPO,
        artifact_id: artifactId,
        archive_format: "zip",
      }
    );

    const downloadedArtifact = await octokit.actions.downloadArtifact({
      owner: process.env.REACT_APP_GITHUB_OWNER,
      repo: process.env.REACT_APP_GITHUB_REPO,
      artifact_id: artifactId,
      archive_format: "zip",
    });

    if (downloadedArtifact.data instanceof ArrayBuffer) {
      console.log({ downloadedArtifact });
      await JSZip.loadAsync(downloadedArtifact.data);
    } else {
      // error
    }

    // const { url } = octokit.actions.downloadArtifact.endpoint({
    //   owner: process.env.REACT_APP_GITHUB_OWNER,
    //   repo: process.env.REACT_APP_GITHUB_REPO,
    //   artifact_id: artifactId,
    //   archive_format: "zip",
    // });
    // octokit.rest.actions.downloadArtifact({
    //   owner: process.env.REACT_APP_GITHUB_OWNER,
    //   repo: process.env.REACT_APP_GITHUB_REPO,
    //   artifact_id: artifactId,
    //   archive_format: "archive_format",
    // });
  };

  return (
    <div className="bottom-actions">
      {location.pathname !== "/" && (
        <>
          <Button onClick={handleSave} startIcon={<SaveIcon />}>
            Save
          </Button>
          <DownloadButton />
          <Button onClick={commitToGitHub} startIcon={<SaveIcon />}>
            Update and Commit to Github
          </Button>
          <Button onClick={getArtifact} startIcon={<SaveIcon />}>
            artifact
          </Button>
        </>
      )}
    </div>
  );
};
