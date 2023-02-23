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
const archive_format = "zip";

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

  // alan todo find a way to commit to git hub
  // wait for action to complete
  // then download artifiact

  const testAction = async () => {
    console.log("testaction");
    // log into github
    const octokit = new Octokit({
      auth: process.env.REACT_APP_GITHUB_TOKEN,
    });

    // get SHA of file you want to write over
    const path = "config/corne.keymap";

    async function getSHA(path) {
      const result = await octokit.repos.getContent({
        owner: process.env.REACT_APP_GITHUB_OWNER,
        repo: process.env.REACT_APP_GITHUB_REPO,
        path,
      });

      const sha = result?.data?.sha;

      return sha;
    }
    const sha = await getSHA(path);
    console.log({ sha });

    return octokit.rest.checks.listSuitesForRef({
      owner,
      repo,
      ref: "master",
    });

    const refs = await octokit.rest.checks.listSuitesForRef({
      owner,
      repo,
      ref: "master",
    });
    console.log({ refs, sha });
    return refs.data;
  };

  const getStatusOfRef = () => {
    console.log("started");
    // Will execute myCallback every 0.5 seconds
    let maxAttempts = 4;
    const intervalID = window.setInterval(myCallback, 30000);

    async function myCallback() {
      // Your code here
      if (maxAttempts === 0) {
        clearInterval(intervalID);
      } else {
        try {
          const ref = await testAction();
          if (ref.check_suites[0].status === "complete") {
            console.log("completed");
            clearInterval(intervalID);
          }
          console.log({ ref });
        } catch (error) {}
      }

      console.log({ maxAttempts });
      maxAttempts = maxAttempts - 1;
    }
  };

  // const asyncLoop1 = () => {
  //   console.log("started");
  //   // Will execute myCallback every 0.5 seconds
  //   let maxAttempts = 4;
  //   const intervalID = window.setInterval(myCallback, 1000);

  //   async function myCallback() {
  //     if (maxAttempts === 0) {
  //       console.log("reached max attempts");
  //       clearInterval(intervalID);
  //     } else {
  //       console.log(`attempt ${maxAttempts}`);
  //       await testAction()
  //         .then((res) => {
  //           console.log({ res });

  //           if (res.data.check_suites[0].status === "complete") {
  //             console.log("should cancel because critera met");
  //             clearInterval(intervalID);
  //           }
  //         })
  //         .catch((error) => console.log({ error }));
  //       maxAttempts = maxAttempts - 1;
  //     }
  //   }
  // };
  const getArtifactByRefId = async (refId) => {
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

  const asyncLoop = async () => {
    console.log("started");

    let maxTries = 4;
    const intervalID = window.setInterval(myCallback, 60000);

    async function myCallback() {
      console.log("attempt ", maxTries);
      if (maxTries >= 0) {
        try {
          const ref = await testAction();
          console.log({ ref });
          if (ref.data.check_suites[0].status === "completed") {
            console.log("should cancel because critera met");
            getArtifactByRefId();
            maxTries = 0;
          } else {
            maxTries = maxTries - 1;
          }
        } catch (error) {}
      } else {
        console.log("clear", { maxTries });
        clearInterval(intervalID);
      }
    }
  };

  //   for (let i = 0; i < maxTries; ++i)
  //     try {
  //       // What you want to attempt. "await"ing if it returns a promise.
  //       const ref = await testAction();
  //       throw Error;
  //       console.log({ ref });
  //       break;
  //     } catch (e) {
  //       console.error(e);
  //     }
  // };

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
          <Button onClick={asyncLoop} startIcon={<SaveIcon />}>
            Test
          </Button>
        </>
      )}
    </div>
  );
};
