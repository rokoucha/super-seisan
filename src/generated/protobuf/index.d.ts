import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace super_seisan. */
export namespace super_seisan {

    /** Properties of a Transactions. */
    interface ITransactions {

        /** Transactions item */
        item: string;

        /** Transactions buyer */
        buyer: string;

        /** Transactions price */
        price: number;

        /** Transactions quantity */
        quantity: number;

        /** Transactions exemptions */
        exemptions?: (string[]|null);

        /** Transactions currencySymbol */
        currencySymbol?: (string|null);
    }

    /** Represents a Transactions. */
    class Transactions implements ITransactions {

        /**
         * Constructs a new Transactions.
         * @param [properties] Properties to set
         */
        constructor(properties?: super_seisan.ITransactions);

        /** Transactions item. */
        public item: string;

        /** Transactions buyer. */
        public buyer: string;

        /** Transactions price. */
        public price: number;

        /** Transactions quantity. */
        public quantity: number;

        /** Transactions exemptions. */
        public exemptions: string[];

        /** Transactions currencySymbol. */
        public currencySymbol: string;

        /**
         * Creates a new Transactions instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Transactions instance
         */
        public static create(properties?: super_seisan.ITransactions): super_seisan.Transactions;

        /**
         * Encodes the specified Transactions message. Does not implicitly {@link super_seisan.Transactions.verify|verify} messages.
         * @param message Transactions message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: super_seisan.ITransactions, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Transactions message, length delimited. Does not implicitly {@link super_seisan.Transactions.verify|verify} messages.
         * @param message Transactions message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: super_seisan.ITransactions, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Transactions message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Transactions
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): super_seisan.Transactions;

        /**
         * Decodes a Transactions message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Transactions
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): super_seisan.Transactions;

        /**
         * Verifies a Transactions message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Transactions message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Transactions
         */
        public static fromObject(object: { [k: string]: any }): super_seisan.Transactions;

        /**
         * Creates a plain object from a Transactions message. Also converts values to other types if specified.
         * @param message Transactions
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: super_seisan.Transactions, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Transactions to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Transactions
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Currency. */
    interface ICurrency {

        /** Currency symbol */
        symbol: string;

        /** Currency rate */
        rate: number;
    }

    /** Represents a Currency. */
    class Currency implements ICurrency {

        /**
         * Constructs a new Currency.
         * @param [properties] Properties to set
         */
        constructor(properties?: super_seisan.ICurrency);

        /** Currency symbol. */
        public symbol: string;

        /** Currency rate. */
        public rate: number;

        /**
         * Creates a new Currency instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Currency instance
         */
        public static create(properties?: super_seisan.ICurrency): super_seisan.Currency;

        /**
         * Encodes the specified Currency message. Does not implicitly {@link super_seisan.Currency.verify|verify} messages.
         * @param message Currency message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: super_seisan.ICurrency, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Currency message, length delimited. Does not implicitly {@link super_seisan.Currency.verify|verify} messages.
         * @param message Currency message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: super_seisan.ICurrency, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Currency message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Currency
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): super_seisan.Currency;

        /**
         * Decodes a Currency message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Currency
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): super_seisan.Currency;

        /**
         * Verifies a Currency message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Currency message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Currency
         */
        public static fromObject(object: { [k: string]: any }): super_seisan.Currency;

        /**
         * Creates a plain object from a Currency message. Also converts values to other types if specified.
         * @param message Currency
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: super_seisan.Currency, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Currency to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Currency
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Payload. */
    interface IPayload {

        /** Payload transactions */
        transactions?: (super_seisan.ITransactions[]|null);

        /** Payload users */
        users?: (string[]|null);

        /** Payload currencies */
        currencies?: (super_seisan.ICurrency[]|null);
    }

    /** Represents a Payload. */
    class Payload implements IPayload {

        /**
         * Constructs a new Payload.
         * @param [properties] Properties to set
         */
        constructor(properties?: super_seisan.IPayload);

        /** Payload transactions. */
        public transactions: super_seisan.ITransactions[];

        /** Payload users. */
        public users: string[];

        /** Payload currencies. */
        public currencies: super_seisan.ICurrency[];

        /**
         * Creates a new Payload instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Payload instance
         */
        public static create(properties?: super_seisan.IPayload): super_seisan.Payload;

        /**
         * Encodes the specified Payload message. Does not implicitly {@link super_seisan.Payload.verify|verify} messages.
         * @param message Payload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: super_seisan.IPayload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Payload message, length delimited. Does not implicitly {@link super_seisan.Payload.verify|verify} messages.
         * @param message Payload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: super_seisan.IPayload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Payload message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Payload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): super_seisan.Payload;

        /**
         * Decodes a Payload message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Payload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): super_seisan.Payload;

        /**
         * Verifies a Payload message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Payload message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Payload
         */
        public static fromObject(object: { [k: string]: any }): super_seisan.Payload;

        /**
         * Creates a plain object from a Payload message. Also converts values to other types if specified.
         * @param message Payload
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: super_seisan.Payload, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Payload to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Payload
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
