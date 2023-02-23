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

const owner = process.env.REACT_APP_GITHUB_OWNER;
const repo = process.env.REACT_APP_GITHUB_REPO;

// todo alan : clean up this file
/* look into reuse */

export const BottomActions = () => {
  const {
    saveLayout,
    layout: { layers },
  } = useContext(LayoutContext);
  const location = useLocation();

  const handleSave = () => {
    saveLayout();
  };

  const commitToGitHub2 = async () => {
    console.log("commitToGitHub2");
    try {
      // log into github
      const octokit = new Octokit({
        auth: process.env.REACT_APP_GITHUB_TOKEN,
      });

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
      async function commitConfig(config) {
        const path = "config/corne.keymap";
        const sha = await getSHA(path);

        const result = await octokit.repos.createOrUpdateFileContents({
          owner: process.env.REACT_APP_GITHUB_OWNER,
          repo: process.env.REACT_APP_GITHUB_REPO,
          path,
          message: `updated config from gui`,
          content: config,
          sha,
        });

        return result?.status || 500;
      }
      // this is the context to commit
      const config = Base64.encode(generateBlob(layers));

      await commitConfig(config);
    } catch (error) {}
  };

  const downloadArtifact = async () => {
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

    // this is the last artifact id, may want to store artifact Id with layout
    const artifactId = resp.data.artifacts[0].id;

    let { url } = await octokit.request(
      "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}",
      {
        owner: process.env.REACT_APP_GITHUB_OWNER,
        repo: process.env.REACT_APP_GITHUB_REPO,
        artifact_id: artifactId,
        archive_format: "zip",
      }
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `FileName.zip`);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);
  };

  const superAction = async () => {
    console.log("start super action");
    try {
      // commit to github
      const initalRun = await getRuns();
      const initalRunCount = initalRun?.data?.total_count;
      console.log({ initalRun });
      await commitToGitHub2();
      console.log("commited");

      let maxTries = 20;
      const intervalID = window.setInterval(myCallback, 20000);

      async function myCallback() {
        console.log(`attempt ${maxTries}`);
        if (maxTries >= 1) {
          try {
            const currentRun = await getRuns();
            const currentRunCount = currentRun?.data?.total_count;
            console.log({ currentRunCount, initalRunCount });

            if (currentRunCount > initalRunCount) {
              console.log("new run added");
              if (
                currentRun?.data?.workflow_runs[0]?.conclusion === "success"
              ) {
                maxTries = 0;
                console.log("now download file");
                clearInterval(intervalID);
                downloadArtifact();
              } else {
                console.log("waiting on run to finish");
                maxTries = maxTries - 1;
              }
            } else {
              console.log("waiting on new run");
              maxTries = maxTries - 1;
            }
          } catch (error) {
            console.log({ error });
          }
        } else {
          console.log("clear", { maxTries });
          clearInterval(intervalID);
        }
      }
    } catch (error) {}
  };

  const getRuns = async () => {
    // log into github
    const octokit = new Octokit({
      auth: process.env.REACT_APP_GITHUB_TOKEN,
    });

    return octokit.actions.listWorkflowRunsForRepo({
      owner: owner,
      repo: repo,
      per_page: 1,
    });
  };

  return (
    <div className="bottom-actions">
      {location.pathname !== "/" && (
        <>
          <Button onClick={handleSave} startIcon={<SaveIcon />}>
            Save
          </Button>
          <DownloadButton />

          <Button onClick={superAction} startIcon={<SaveIcon />}>
            super
          </Button>
        </>
      )}
    </div>
  );
};
