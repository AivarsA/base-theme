/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { Field } from 'Util/Query';
import { ProductListQuery } from 'Query';
import { isSignedIn } from 'Util/Auth';

export class CartQuery {
    getCartQuery(quoteId) {
        const query = new Field('getCartForCustomer')
            .addFieldList(this._getCartTotalsFields(quoteId))
            .setAlias('cartData');

        if (!isSignedIn()) query.addArgument('guestCartId', 'String', quoteId);

        return query;
    }

    getCreateEmptyCartMutation() {
        return new Field('createEmptyCart');
    }

    getSaveCartItemMutation(product, quoteId) {
        const mutation = new Field('saveCartItem')
            .addArgument('cartItem', 'CartItemInput!', product)
            .addFieldList(this._getSaveCartItemFields(quoteId));

        if (!isSignedIn()) mutation.addArgument('guestCartId', 'String', quoteId);

        return mutation;
    }

    getRemoveCartItemMutation(item_id, quoteId) {
        const mutation = new Field('removeCartItem')
            .addArgument('item_id', 'Int!', item_id)
            .addFieldList(this._getRemoveCartItemFields(quoteId));

        if (!isSignedIn()) mutation.addArgument('guestCartId', 'String', quoteId);

        return mutation;
    }

    getApplyCouponMutation(couponCode, quoteId) {
        const mutation = new Field('applyCoupon')
            .addArgument('coupon_code', 'String!', couponCode)
            .addField(this.getCartQuery(quoteId));

        if (!isSignedIn()) mutation.addArgument('guestCartId', 'String', quoteId);

        return mutation;
    }

    getRemoveCouponMutation(quoteId) {
        const mutation = new Field('removeCoupon')
            .addField(this.getCartQuery(quoteId));

        if (!isSignedIn()) mutation.addArgument('guestCartId', 'String', quoteId);

        return mutation;
    }

    getApplyGiftCardMutation(giftCardCode, quoteId) {
        const mutation = new Field('applyGiftCard')
            .addArgument('gift_card_code', 'String!', giftCardCode)
            .addField(this.getCartQuery(quoteId));

        if (!isSignedIn()) mutation.addArgument('guestCartId', 'String', quoteId);

        return mutation;
    }

    getRemoveGiftCardFromCartMutation(giftCardCode, quoteId) {
        const mutation = new Field('removeGiftCard')
            .addArgument('gift_card_code', 'String!', giftCardCode)
            .addField(this.getCartQuery(quoteId));

        if (!isSignedIn()) mutation.addArgument('guestCartId', 'String', quoteId);

        return mutation;
    }

    getApplyStoreCreditMutation(quoteId) {
        const mutation = new Field('applyStoreCredit')
            .addField(this.getCartQuery(quoteId));

        if (!isSignedIn()) mutation.addArgument('guestCartId', 'String', quoteId);

        return mutation;
    }

    getRemoveStoreCreditMutation(quoteId) {
        const mutation = new Field('removeStoreCredit')
            .addField(this.getCartQuery(quoteId));

        if (!isSignedIn()) mutation.addArgument('guestCartId', 'String', quoteId);

        return mutation;
    }

    _getSaveCartItemFields(quoteId) {
        return [
            this.getCartQuery(quoteId)
        ];
    }

    _getRemoveCartItemFields(quoteId) {
        return [
            this.getCartQuery(quoteId)
        ];
    }

    _getCartTotalsFields(quoteId) {
        return [
            'subtotal',
            'items_qty',
            'tax_amount',
            'grand_total',
            'discount_amount',
            'quote_currency_code',
            'subtotal_with_discount',
            'subtotal_incl_tax',
            'coupon_code',
            'shipping_amount',
            'is_virtual',
            this._getAppliedGiftCards(quoteId),
            this._getAppliedStoreCredit(),
            this._getCartItemsField()
        ];
    }

    _getAppliedGiftCards(quoteId) {
        const mutation = new Field('applied_gift_cards')
            .addFieldList([
                'code',
                'expiration_date',
                this._getCurrentBalance(),
                this._getAppliedBalance()
            ]);

        if (!isSignedIn()) mutation.addArgument('guestCartId', 'String', quoteId);

        return mutation;
    }

    _getAppliedStoreCredit() {
        return new Field('applied_store_credit')
            .addFieldList([
                'enabled',
                this._getCurrentBalance(),
                this._getAppliedBalance()
            ]);
    }

    _getCurrentBalance() {
        return new Field('current_balance')
            .addFieldList([
                'value',
                'currency'
            ]);
    }

    _getAppliedBalance() {
        return new Field('applied_balance')
            .addFieldList([
                'value',
                'currency'
            ]);
    }

    _getCartItemFields() {
        return [
            'qty',
            'sku',
            'price',
            'item_id',
            'row_total',
            'tax_amount',
            'tax_percent',
            'discount_amount',
            'discount_percent',
            this._getProductField()
        ];
    }

    _getProductField() {
        return new Field('product')
            .addFieldList(ProductListQuery._getProductInterfaceFields(false, true));
    }

    _getCartItemsField() {
        return new Field('items')
            .addFieldList(this._getCartItemFields());
    }
}

export default new CartQuery();
