<?php

class Supplier extends BaseModel
{
    protected $table = 'supplier';

    public function getId()
    {
        return $this->attributes['supplierID'];
    }

    /* scopes */
    public function scopeWhereValid($query)
    {
        return $query->whereNotDeleted();
    }

    public function scopeWhereNotDeleted($query)
    {
        return $query->where($this->table . '.isDeleted', '=', 0);
    }

    public function scopeWhereCode($query, $code)
    {
        return $query->where($this->table . '.supplierCode', '=', $code);
    }

    /* static */
    public static function isValid($code)
    {
        $exist = self::whereValid()->whereCode($code)->exists();

        return $exist;
    }

    public static function getSupplierIDByCode($supplierCode) 
    {
        $supplierID = Supplier::select('supplierID')->where('supplierCode', '=', $supplierCode)->where('isDeleted', '=', 0)->first();
        
        return $supplierID;
    }

/*        $orderProducts = $query->get(['es_order_product.*', 
                            'es_order.invoice_no', 
                            'es_order.buyer_id as buyer_seller_id', 
                            'buyer.username as buyer_seller_username', 
                            DB::raw('COALESCE(NULLIF(buyer.store_name, ""), buyer.username) as buyer_seller_storename'),
                            'es_product.name as productname', 
                            'es_order_product_status.name as statusname',
                            'es_order.dateadded',
                            DB::raw('COALESCE(IF( es_order.dateadded < "'.$billingInfoChangeDate.'", es_bank_info.bank_name, es_order_billing_info.bank_name), "") as bank_name'), 
                            DB::raw('COALESCE(IF( es_order.dateadded < "'.$billingInfoChangeDate.'", es_billing_info.bank_account_name, es_order_billing_info.account_name), "") as account_name'), 
                            DB::raw('COALESCE(IF( es_order.dateadded < "'.$billingInfoChangeDate.'", es_billing_info.bank_account_number, es_order_billing_info.account_number), "") as account_number'),
                        ]);*/
    public static function getAllSuppliers()
    {
        $suppliers = self::where('supplier.isDeleted', '=', '0')
                     ->join('suppliercountry', 'supplier.supplierID', '=', 'suppliercountry.supplierID')
                     ->join('country', 'suppliercountry.countryID', '=', 'country.countryID')
                     ->where('country.countryCode', '=', 'AU')
                     ->get();

        return $suppliers->toArray();
    }
}

