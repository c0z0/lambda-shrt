import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { withRouter } from 'next/router'
import Link from 'next/link'
import fetch from 'isomorphic-fetch'

function bytesToSize(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

function Transfer({ transfer, error }) {
  const [downloading, setDownloading] = useState(false)

  function renderError(text) {
    return (
      <div className="container">
        <a href="https://github.com/c0z0/shrt-ui" className="src">
          [src]
        </a>
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
            color: red;
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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
              'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
              'Helvetica Neue', sans-serif;
          }
        `}</style>
      </div>
    )
  }

  if (error) return renderError('Error')

  const { message, fburl, fileName, senderName, fileSize } = transfer

  return (
    <div className="container">
      <a href="https://github.com/c0z0/shrt-ui" className="src">
        [src]
      </a>

      <div>
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
          <a href={fburl} onClick={() => setDownloading(true)}>
            <div className="download-button">
              {downloading ? 'Downloading' : 'Download'}
            </div>
          </a>
        </div>
        <Link href="/upload" as="/t" prefetch>
          <a className="upload">Upload your own file...</a>
        </Link>
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
          margin-bottom: 12px;
        }
        .message {
          margin: 32px;
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

        .upload {
          color: #000 !important;
          opacity: 0.5;
          text-decoration: none;
          transition: 0.2s all;
          text-align: center;
          display: block;
        }
        .upload:hover,
        .src:hover {
          opacity: 1;
        }

        .download-button {
          margin: 16px 32px;
          margin-top: 32px;
          border: none;
          outline: none;
          padding: 12px;
          background-color: #000;
          color: #fff;
          text-align: center;
          font-size: 12px;
          cursor: pointer;
          border-radius: 4px;
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
            'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
            'Helvetica Neue', sans-serif;
        }
      `}</style>
    </div>
  )
}

Transfer.getInitialProps = async ({ query, req }) => {
  const apiBase = req ? 'https://s.cserdean.com' : ''

  try {
    const res = await fetch(`${apiBase}/api/t/${query.id}`)

    if (!res.ok) return { error: true, transfer: false }

    const transfer = await res.json()

    return { transfer, error: false }
  } catch (e) {
    console.log(e)
    return { error: true, transfer: null }
  }
}

export default withRouter(Transfer)
