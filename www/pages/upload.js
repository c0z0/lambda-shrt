import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";

export default class Upload extends Component {
  state = {
    file: null,
    message: "",
    senderName: "",
    url: null
  };

  bytesToSize(bytes) {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }

  async upload(e) {
    e.preventDefault();

    const { file, senderName, message, loading, url } = this.state;

    if (url) {
      return this.setState({
        file: null,
        message: "",
        senderName: "",
        url: null
      });
    }

    if (!file || !message.length || !senderName.length || loading) return;

    this.setState({ loading: true, error: false });

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("message", message);
      data.append("senderName", senderName);
      data.append("fileSize", file.size);
      const res = await fetch("/api/u", {
        method: "POST",
        body: data
      });

      if (!res.ok) {
        console.log("error");
        return this.setState({ error: false, loading: false });
      }

      console.log(res);

      const { _id } = await res.json();

      this.setState({
        url: `${window.location.href.slice(0, -1)}${_id}`,
        loading: false
      });
      document.getElementById("js-url").select();
    } catch (err) {
      console.log(error);
      this.setState({ error: true, loading: false });
    }
  }

  renderUrl() {
    const { url } = this.state;
    return (
      <div className="container">
        <div>
          <h2 className="title">Here is your link:</h2>
          <input
            type="text"
            value={url}
            className="input"
            id="js-url"
            readOnly
          />
        </div>
        <style jsx>{`
          .title {
            font-weight: normal;
            margin: 16px 0;
            padding: 0;
            text-overflow: ellipsis;
            width: 280px;
            overflow: hidden;
            white-space: nowrap;
            color: white;
          }
          .container {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            z-index: 10;
            background: black;
            display: flex;
            flex-direction: column;
            padding: 0 25px;
            align-items: center;
            justify-content: center;
          }

          .input {
            color: white;
            width: 250px;
            border: none;
            border-bottom: solid rgba(255, 255, 255, 1) 1px;
            padding: 8px 0;
            outline: none;
            font-size: 16px;
            background: none;
            transition: 0.2s all;
            padding-right: 10px;
          }
        `}</style>
      </div>
    );
  }

  render() {
    const { file, senderName, message, loading, url, error } = this.state;

    return (
      <div className="container">
        <a href="https://github.com/c0z0/shrt-ui" className="src">
          [src]
        </a>
        <Link href="/">
          <a className="src t">shrt</a>
        </Link>
        <Head>
          <title>Transfer</title>
        </Head>
        <div className="card">
          <div className="inner-container">
            {url && this.renderUrl()}
            <div className="inner-container">
              <form onSubmit={this.upload.bind(this)}>
                <div className="file-input__container">
                  <h2 className="title">
                    {file ? file.name : "+ Add your file"}
                  </h2>
                  {file && (
                    <p className="file-size">{this.bytesToSize(file.size)}</p>
                  )}
                  <input
                    disabled={loading}
                    type="file"
                    className="file-input"
                    onChange={e => {
                      const [file] = e.target.files;
                      if (file.size > 2e9)
                        return alert("File exceeds maximum of 2GB");
                      this.setState({ file: file });
                      console.log(e.target.files[0]);
                    }}
                  />
                </div>
                {/* <div className="input__container">
							<input type="email" className="input" placeholder="Email to" />
						</div> */}
                <div className="input__container">
                  <input
                    disabled={loading}
                    type="text"
                    className="input"
                    placeholder="Your name"
                    value={senderName}
                    onChange={({ target: { value } }) =>
                      this.setState({ senderName: value })
                    }
                  />
                </div>
                <div className="input__container">
                  <textarea
                    disabled={loading}
                    className="input"
                    placeholder="Message"
                    rows="2"
                    value={message}
                    onChange={({ target: { value } }) =>
                      this.setState({ message: value })
                    }
                  />
                </div>
                {error && <p className="error">Something went wrong</p>}
                <input
                  type="submit"
                  value={
                    loading ? "Loading" : url ? "Upload another" : "Upload"
                  }
                  className={`submit-button ${
                    (!file ||
                      !message.length ||
                      !senderName.length ||
                      loading) &&
                    !url
                      ? "submit-button--disabled"
                      : ""
                  }`}
                  disabled={
                    (!file ||
                      !message.length ||
                      !senderName.length ||
                      loading) &&
                    !url
                  }
                />
              </form>
            </div>
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
          }

          .error {
            color: red;
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

          .inner-container {
            position: relative;
          }

          .input {
            width: 300px;
            border: none;
            border-bottom: solid rgba(0, 0, 0, 0.4) 1px;
            padding: 8px 0;
            outline: none;
            font-size: 16px;
            background: none;
            transition: 0.2s all;
            color: black;
            padding-right: 10px;
          }

          input.input {
            height: 18px;
          }
          .input:focus {
            border-color: rgba(0, 0, 0, 1);
          }

          .input__container {
            position: relative;
            margin: 32px;
            margin-top: 16px;
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

          .file-input__container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            height: 128px;
            width: 100%;
            transition: all 0.2s;
            border-bottom: 1px solid black;
          }

          .file-input__container:hover {
            color: #484848;
          }

          .file-input {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            width: 100%;
            opacity: 0;
            cursor: pointer;
          }

          .submit-button {
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

          .submit-button--disabled {
            background: #777;
            cursor: default;
          }

          .error {
            text-align: center;
            color: #ff001f;
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
}
