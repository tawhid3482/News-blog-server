"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeiliSearchIndex = exports.deleteDocumentFromIndex = void 0;
exports.addDocumentToIndex = addDocumentToIndex;
const meilisearch_1 = require("meilisearch");
const config_1 = __importDefault(require("../config"));
const post_constant_1 = require("../app/modules/post/post.constant");
const meiliClient = new meilisearch_1.MeiliSearch({
    host: config_1.default.meiliHost,
    apiKey: config_1.default.meiliApiKey,
});
function addDocumentToIndex(result, indexKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const index = meiliClient.index(indexKey);
        const { id, title, content, coverImage } = result;
        const image = coverImage || post_constant_1.noImage;
        try {
            // Check if the document already exists
            const existing = yield index.getDocument(id).catch(() => null);
            if (existing) {
                return;
            }
            const document = {
                id,
                title,
                content,
                image: image,
            };
            yield index.addDocuments([document]);
        }
        catch (error) {
            console.error("Error adding document to MeiliSearch:", error);
        }
    });
}
const deleteDocumentFromIndex = (indexKey, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const index = meiliClient.index(indexKey);
        yield index.deleteDocument(id);
    }
    catch (error) {
        console.error(`❌ Failed to delete document with ID ${id} from MeiliSearch index "${indexKey}":`, (error === null || error === void 0 ? void 0 : error.message) || error);
    }
});
exports.deleteDocumentFromIndex = deleteDocumentFromIndex;
const deleteMeiliSearchIndex = (indexKey) => __awaiter(void 0, void 0, void 0, function* () {
    meiliClient.deleteIndex(indexKey);
});
exports.deleteMeiliSearchIndex = deleteMeiliSearchIndex;
exports.default = meiliClient;
