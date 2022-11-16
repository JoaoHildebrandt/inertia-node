"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodedPageProps = void 0;
const encodedPageProps = (props) => JSON.stringify(props).replace(/"/g, "&quot;").replace(/'/g, "&#039;");
exports.encodedPageProps = encodedPageProps;
