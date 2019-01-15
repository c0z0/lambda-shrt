import React, { useState, useEffect } from "react";
import Head from "next/head";
import { withRouter } from "next/router";
import Link from "next/link";

function bytesToSize(bytes) {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

export default withRouter(function Transfer(props) {
  const id = props.router.query.id;

  const [data, setData] = useState({
    loading: true,
    error: false,
    transfer: null,
    downloading: false
  });

  useEffect(
    () => {
      (async () => {
        const res = await fetch(`/api/t/${id}`);

        if (!res.ok) {
          return setData({
            loading: false,
            error: true,
            transfer: null
          });
        }

        const transfer = await res.json();

        setData({
          loading: false,
          error: false,
          transfer
        });
      })();
    },
    [id]
  );

  function renderError(text) {
    return (
      <div className="container">
        <a href="https://github.com/c0z0/shrt-ui" className="src">
          [src]
        </a>
        <Link href="/">
          <a className="src t">shrt</a>
        </Link>
        <div className="card">
          <div className="file-name__container">
            <h2 className="title">{text}</h2>
          </div>
        </div>
        <style jsx>{`
          .container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }

          .card {
            border: 1px #ddd solid;
            border-radius: 4px;
            width: 366px;
          }
          .message {
            padding: 16px;
          }

          .message span {
            color: #777;
          }

          a {
            text-decoration: none;
          }

          .src {
            color: #000 !important;
            opacity: 0.5;
            font-family: Menlo;
            text-decoration: none;
            transition: 0.2s all;
            position: absolute;
            top: 16px;
            right: 16px;
          }

          .t {
            left: 16px;
          }

          .download-button {
            margin: 32px;
            border: none;
            outline: none;
            padding: 12px;
            background-color: #000;
            color: #fff;
            text-align: center;
            font-size: 12px;
            cursor: pointer;
            border-radius: 4px;
            float: right;
          }
          .title {
            font-weight: normal;
            margin: 0;
            padding: 0;
            text-overflow: ellipsis;
            width: 280px;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
          }

          .file-size {
            color: #ccc;
            margin: 0;
          }

          .file-name__container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            height: 128px;
            transition: all 0.2s;
          }
        `}</style>
        <style jsx global>{`
          body {
            margin: 0;
            padding: 0;
            color: #000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
              "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
              "Helvetica Neue", sans-serif;
          }
        `}</style>
      </div>
    );
  }

  if (data.loading) return renderError("Loading");
  if (data.error) return renderError("Error");

  const { message, fburl, fileName, senderName, fileSize } = data.transfer;

  return (
    <div className="container">
      <a href="https://github.com/c0z0/shrt-ui" className="src">
        [src]
      </a>
      <Link href="/">
        <a className="src t">shrt</a>
      </Link>
      <div className="card">
        <Head>
          <title>{fileName} - Transfer</title>
        </Head>
        <div className="file-name__container">
          <h2 className="title">{fileName}</h2>
          <p className="file-size">{bytesToSize(fileSize)}</p>
        </div>
        <p className="message">
          Message: <span>{message}</span>
        </p>
        <p className="message">
          From: <span>{senderName}</span>
        </p>
        <a href={fburl} onClick={() => setData({ ...data, downloading: true })}>
          <div className="download-button">
            {data.downloading ? "Downloading" : "Download"}
          </div>
        </a>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .card {
          border: 1px #ddd solid;
          border-radius: 4px;
          width: 366px;
        }
        .message {
          padding: 16px;
        }

        .message span {
          color: #777;
        }

        a {
          text-decoration: none;
        }

        .src {
          color: #000 !important;
          opacity: 0.5;
          font-family: Menlo;
          text-decoration: none;
          transition: 0.2s all;
          position: absolute;
          top: 16px;
          right: 16px;
        }

        .t {
          left: 16px;
        }

        .download-button {
          margin: 32px;
          border: none;
          outline: none;
          padding: 12px;
          background-color: #000;
          color: #fff;
          text-align: center;
          font-size: 12px;
          cursor: pointer;
          border-radius: 4px;
          float: right;
        }
        .title {
          font-weight: normal;
          margin: 0;
          padding: 0;
          text-overflow: ellipsis;
          width: 280px;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
        }

        .file-size {
          color: #ccc;
          margin: 0;
        }

        .file-name__container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          height: 128px;
          transition: all 0.2s;
          border-bottom: 1px solid black;
        }
      `}</style>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          color: #000;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif;
        }
      `}</style>
    </div>
  );
});
