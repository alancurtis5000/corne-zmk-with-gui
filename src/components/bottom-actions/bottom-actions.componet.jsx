import React, { useContext, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { LinearProgress, Button, Typography } from "@mui/material";
import "./bottom-actions.styles.scss";
import DownloadIcon from "@mui/icons-material/Download";
import { LayoutContext } from "../../providers/layout/layout.provider";
import { useLocation } from "react-router-dom";
import { Base64 } from "js-base64";
import { Octokit } from "@octokit/rest";
import { generateBlob } from "../download-button/blob-content";

const owner = process.env.REACT_APP_GITHUB_OWNER;
const repo = process.env.REACT_APP_GITHUB_REPO;

export const BottomActions = () => {
  const {
    setLayout,
    saveLayout,
    layout: { layers },
    layout,
  } = useContext(LayoutContext);
  const location = useLocation();
  const [progressMessage, setProgressMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const handleSave = () => {
    saveLayout();
  };

  // log into github
  const octokit = new Octokit({
    auth: process.env.REACT_APP_GITHUB_TOKEN,
  });

  const commitToGitHub = async () => {
    setProgressMessage("commiting to github");
    setProgress(5);
    console.log("commitToGitHub");
    try {
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
      setProgressMessage("commit success");
      setProgress(10);
    } catch (error) {}
  };

  const downloadArtifact = async () => {
    setProgressMessage("dowloading Artifact");
    setProgress(90);
    const resp = await octokit.request(
      `GET /repos/{owner}/{repo}/actions/artifacts`,
      {
        owner: process.env.REACT_APP_GITHUB_OWNER,
        repo: process.env.REACT_APP_GITHUB_REPO,
      }
    );

    // this is the last artifact id, may want to store artifact Id with layout
    const artifactId = resp.data.artifacts[0].id;
    setLayout({ ...layout, lastArtifactId: artifactId });
    handleSave();

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
    setProgressMessage("Complete");
    setProgress(100);
    setTimeout(() => {
      setProgressMessage("");
      setProgress(0);
    }, 1000);
  };

  const superAction = async () => {
    console.log("start super action");
    try {
      // commit to github
      const initalRun = await getRuns();
      const initalRunCount = initalRun?.data?.total_count;
      console.log({ initalRun });
      await commitToGitHub();
      console.log("commited");

      let maxTries = 20;
      let currentTry = 0;
      const intervalID = window.setInterval(myCallback, 20000);

      async function myCallback() {
        console.log(`attempt ${maxTries}`);

        if (maxTries >= 1) {
          currentTry = currentTry + 1;
          try {
            const currentRun = await getRuns();
            const currentRunCount = currentRun?.data?.total_count;
            console.log({ currentRunCount, initalRunCount });

            if (currentRunCount > initalRunCount) {
              console.log("new run added");
              setProgressMessage(`waiting on run to finish (${currentTry})`);
              setProgress(currentTry * 8);
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
              setProgressMessage("checking runs");
              setProgress(currentTry * 8);
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
    return octokit.actions.listWorkflowRunsForRepo({
      owner: owner,
      repo: repo,
      per_page: 1,
    });
  };

  const downloadLastArtifact = async () => {
    setProgressMessage("dowloading Artifact");
    setProgress(90);
    const resp = await octokit.request(
      `GET /repos/{owner}/{repo}/actions/artifacts`,
      {
        owner: process.env.REACT_APP_GITHUB_OWNER,
        repo: process.env.REACT_APP_GITHUB_REPO,
      }
    );

    const artifactId = layout.lastArtifactId;

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

  return (
    <div className="bottom-actions">
      <div className="actions">
        {location.pathname !== "/" && (
          <>
            <Button onClick={handleSave} startIcon={<SaveIcon />}>
              Save
            </Button>
            <Button onClick={downloadLastArtifact} startIcon={<DownloadIcon />}>
              Download Last Built
            </Button>
            <Button onClick={superAction} startIcon={<DownloadIcon />}>
              Create Firmware
            </Button>
          </>
        )}
      </div>
      {progress > 0 && (
        <div className="progress">
          <LinearProgress variant="determinate" value={progress} />
          <Typography>{progressMessage}</Typography>
        </div>
      )}
    </div>
  );
};
