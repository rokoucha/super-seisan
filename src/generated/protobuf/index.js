/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const super_seisan = $root.super_seisan = (() => {

    /**
     * Namespace super_seisan.
     * @exports super_seisan
     * @namespace
     */
    const super_seisan = {};

    super_seisan.Transactions = (function() {

        /**
         * Properties of a Transactions.
         * @memberof super_seisan
         * @interface ITransactions
         * @property {string} item Transactions item
         * @property {string} buyer Transactions buyer
         * @property {number} price Transactions price
         * @property {number} quantity Transactions quantity
         * @property {Array.<string>|null} [exemptions] Transactions exemptions
         */

        /**
         * Constructs a new Transactions.
         * @memberof super_seisan
         * @classdesc Represents a Transactions.
         * @implements ITransactions
         * @constructor
         * @param {super_seisan.ITransactions=} [properties] Properties to set
         */
        function Transactions(properties) {
            this.exemptions = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Transactions item.
         * @member {string} item
         * @memberof super_seisan.Transactions
         * @instance
         */
        Transactions.prototype.item = "";

        /**
         * Transactions buyer.
         * @member {string} buyer
         * @memberof super_seisan.Transactions
         * @instance
         */
        Transactions.prototype.buyer = "";

        /**
         * Transactions price.
         * @member {number} price
         * @memberof super_seisan.Transactions
         * @instance
         */
        Transactions.prototype.price = 0;

        /**
         * Transactions quantity.
         * @member {number} quantity
         * @memberof super_seisan.Transactions
         * @instance
         */
        Transactions.prototype.quantity = 0;

        /**
         * Transactions exemptions.
         * @member {Array.<string>} exemptions
         * @memberof super_seisan.Transactions
         * @instance
         */
        Transactions.prototype.exemptions = $util.emptyArray;

        /**
         * Creates a new Transactions instance using the specified properties.
         * @function create
         * @memberof super_seisan.Transactions
         * @static
         * @param {super_seisan.ITransactions=} [properties] Properties to set
         * @returns {super_seisan.Transactions} Transactions instance
         */
        Transactions.create = function create(properties) {
            return new Transactions(properties);
        };

        /**
         * Encodes the specified Transactions message. Does not implicitly {@link super_seisan.Transactions.verify|verify} messages.
         * @function encode
         * @memberof super_seisan.Transactions
         * @static
         * @param {super_seisan.ITransactions} message Transactions message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Transactions.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 0, wireType 2 =*/2).string(message.item);
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.buyer);
            writer.uint32(/* id 2, wireType 1 =*/17).double(message.price);
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.quantity);
            if (message.exemptions != null && message.exemptions.length)
                for (let i = 0; i < message.exemptions.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.exemptions[i]);
            return writer;
        };

        /**
         * Encodes the specified Transactions message, length delimited. Does not implicitly {@link super_seisan.Transactions.verify|verify} messages.
         * @function encodeDelimited
         * @memberof super_seisan.Transactions
         * @static
         * @param {super_seisan.ITransactions} message Transactions message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Transactions.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Transactions message from the specified reader or buffer.
         * @function decode
         * @memberof super_seisan.Transactions
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {super_seisan.Transactions} Transactions
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Transactions.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.super_seisan.Transactions();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 0: {
                        message.item = reader.string();
                        break;
                    }
                case 1: {
                        message.buyer = reader.string();
                        break;
                    }
                case 2: {
                        message.price = reader.double();
                        break;
                    }
                case 3: {
                        message.quantity = reader.uint32();
                        break;
                    }
                case 4: {
                        if (!(message.exemptions && message.exemptions.length))
                            message.exemptions = [];
                        message.exemptions.push(reader.string());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("item"))
                throw $util.ProtocolError("missing required 'item'", { instance: message });
            if (!message.hasOwnProperty("buyer"))
                throw $util.ProtocolError("missing required 'buyer'", { instance: message });
            if (!message.hasOwnProperty("price"))
                throw $util.ProtocolError("missing required 'price'", { instance: message });
            if (!message.hasOwnProperty("quantity"))
                throw $util.ProtocolError("missing required 'quantity'", { instance: message });
            return message;
        };

        /**
         * Decodes a Transactions message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof super_seisan.Transactions
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {super_seisan.Transactions} Transactions
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Transactions.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Transactions message.
         * @function verify
         * @memberof super_seisan.Transactions
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Transactions.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.item))
                return "item: string expected";
            if (!$util.isString(message.buyer))
                return "buyer: string expected";
            if (typeof message.price !== "number")
                return "price: number expected";
            if (!$util.isInteger(message.quantity))
                return "quantity: integer expected";
            if (message.exemptions != null && message.hasOwnProperty("exemptions")) {
                if (!Array.isArray(message.exemptions))
                    return "exemptions: array expected";
                for (let i = 0; i < message.exemptions.length; ++i)
                    if (!$util.isString(message.exemptions[i]))
                        return "exemptions: string[] expected";
            }
            return null;
        };

        /**
         * Creates a Transactions message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof super_seisan.Transactions
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {super_seisan.Transactions} Transactions
         */
        Transactions.fromObject = function fromObject(object) {
            if (object instanceof $root.super_seisan.Transactions)
                return object;
            let message = new $root.super_seisan.Transactions();
            if (object.item != null)
                message.item = String(object.item);
            if (object.buyer != null)
                message.buyer = String(object.buyer);
            if (object.price != null)
                message.price = Number(object.price);
            if (object.quantity != null)
                message.quantity = object.quantity >>> 0;
            if (object.exemptions) {
                if (!Array.isArray(object.exemptions))
                    throw TypeError(".super_seisan.Transactions.exemptions: array expected");
                message.exemptions = [];
                for (let i = 0; i < object.exemptions.length; ++i)
                    message.exemptions[i] = String(object.exemptions[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a Transactions message. Also converts values to other types if specified.
         * @function toObject
         * @memberof super_seisan.Transactions
         * @static
         * @param {super_seisan.Transactions} message Transactions
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Transactions.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.exemptions = [];
            if (options.defaults) {
                object.item = "";
                object.buyer = "";
                object.price = 0;
                object.quantity = 0;
            }
            if (message.item != null && message.hasOwnProperty("item"))
                object.item = message.item;
            if (message.buyer != null && message.hasOwnProperty("buyer"))
                object.buyer = message.buyer;
            if (message.price != null && message.hasOwnProperty("price"))
                object.price = options.json && !isFinite(message.price) ? String(message.price) : message.price;
            if (message.quantity != null && message.hasOwnProperty("quantity"))
                object.quantity = message.quantity;
            if (message.exemptions && message.exemptions.length) {
                object.exemptions = [];
                for (let j = 0; j < message.exemptions.length; ++j)
                    object.exemptions[j] = message.exemptions[j];
            }
            return object;
        };

        /**
         * Converts this Transactions to JSON.
         * @function toJSON
         * @memberof super_seisan.Transactions
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Transactions.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Transactions
         * @function getTypeUrl
         * @memberof super_seisan.Transactions
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Transactions.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/super_seisan.Transactions";
        };

        return Transactions;
    })();

    super_seisan.Payload = (function() {

        /**
         * Properties of a Payload.
         * @memberof super_seisan
         * @interface IPayload
         * @property {Array.<super_seisan.ITransactions>|null} [transactions] Payload transactions
         * @property {Array.<string>|null} [users] Payload users
         */

        /**
         * Constructs a new Payload.
         * @memberof super_seisan
         * @classdesc Represents a Payload.
         * @implements IPayload
         * @constructor
         * @param {super_seisan.IPayload=} [properties] Properties to set
         */
        function Payload(properties) {
            this.transactions = [];
            this.users = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Payload transactions.
         * @member {Array.<super_seisan.ITransactions>} transactions
         * @memberof super_seisan.Payload
         * @instance
         */
        Payload.prototype.transactions = $util.emptyArray;

        /**
         * Payload users.
         * @member {Array.<string>} users
         * @memberof super_seisan.Payload
         * @instance
         */
        Payload.prototype.users = $util.emptyArray;

        /**
         * Creates a new Payload instance using the specified properties.
         * @function create
         * @memberof super_seisan.Payload
         * @static
         * @param {super_seisan.IPayload=} [properties] Properties to set
         * @returns {super_seisan.Payload} Payload instance
         */
        Payload.create = function create(properties) {
            return new Payload(properties);
        };

        /**
         * Encodes the specified Payload message. Does not implicitly {@link super_seisan.Payload.verify|verify} messages.
         * @function encode
         * @memberof super_seisan.Payload
         * @static
         * @param {super_seisan.IPayload} message Payload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Payload.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.transactions != null && message.transactions.length)
                for (let i = 0; i < message.transactions.length; ++i)
                    $root.super_seisan.Transactions.encode(message.transactions[i], writer.uint32(/* id 0, wireType 2 =*/2).fork()).ldelim();
            if (message.users != null && message.users.length)
                for (let i = 0; i < message.users.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.users[i]);
            return writer;
        };

        /**
         * Encodes the specified Payload message, length delimited. Does not implicitly {@link super_seisan.Payload.verify|verify} messages.
         * @function encodeDelimited
         * @memberof super_seisan.Payload
         * @static
         * @param {super_seisan.IPayload} message Payload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Payload.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Payload message from the specified reader or buffer.
         * @function decode
         * @memberof super_seisan.Payload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {super_seisan.Payload} Payload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Payload.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.super_seisan.Payload();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 0: {
                        if (!(message.transactions && message.transactions.length))
                            message.transactions = [];
                        message.transactions.push($root.super_seisan.Transactions.decode(reader, reader.uint32()));
                        break;
                    }
                case 1: {
                        if (!(message.users && message.users.length))
                            message.users = [];
                        message.users.push(reader.string());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Payload message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof super_seisan.Payload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {super_seisan.Payload} Payload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Payload.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Payload message.
         * @function verify
         * @memberof super_seisan.Payload
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Payload.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.transactions != null && message.hasOwnProperty("transactions")) {
                if (!Array.isArray(message.transactions))
                    return "transactions: array expected";
                for (let i = 0; i < message.transactions.length; ++i) {
                    let error = $root.super_seisan.Transactions.verify(message.transactions[i]);
                    if (error)
                        return "transactions." + error;
                }
            }
            if (message.users != null && message.hasOwnProperty("users")) {
                if (!Array.isArray(message.users))
                    return "users: array expected";
                for (let i = 0; i < message.users.length; ++i)
                    if (!$util.isString(message.users[i]))
                        return "users: string[] expected";
            }
            return null;
        };

        /**
         * Creates a Payload message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof super_seisan.Payload
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {super_seisan.Payload} Payload
         */
        Payload.fromObject = function fromObject(object) {
            if (object instanceof $root.super_seisan.Payload)
                return object;
            let message = new $root.super_seisan.Payload();
            if (object.transactions) {
                if (!Array.isArray(object.transactions))
                    throw TypeError(".super_seisan.Payload.transactions: array expected");
                message.transactions = [];
                for (let i = 0; i < object.transactions.length; ++i) {
                    if (typeof object.transactions[i] !== "object")
                        throw TypeError(".super_seisan.Payload.transactions: object expected");
                    message.transactions[i] = $root.super_seisan.Transactions.fromObject(object.transactions[i]);
                }
            }
            if (object.users) {
                if (!Array.isArray(object.users))
                    throw TypeError(".super_seisan.Payload.users: array expected");
                message.users = [];
                for (let i = 0; i < object.users.length; ++i)
                    message.users[i] = String(object.users[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a Payload message. Also converts values to other types if specified.
         * @function toObject
         * @memberof super_seisan.Payload
         * @static
         * @param {super_seisan.Payload} message Payload
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Payload.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.transactions = [];
                object.users = [];
            }
            if (message.transactions && message.transactions.length) {
                object.transactions = [];
                for (let j = 0; j < message.transactions.length; ++j)
                    object.transactions[j] = $root.super_seisan.Transactions.toObject(message.transactions[j], options);
            }
            if (message.users && message.users.length) {
                object.users = [];
                for (let j = 0; j < message.users.length; ++j)
                    object.users[j] = message.users[j];
            }
            return object;
        };

        /**
         * Converts this Payload to JSON.
         * @function toJSON
         * @memberof super_seisan.Payload
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Payload.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Payload
         * @function getTypeUrl
         * @memberof super_seisan.Payload
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Payload.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/super_seisan.Payload";
        };

        return Payload;
    })();

    return super_seisan;
})();

export { $root as default };
