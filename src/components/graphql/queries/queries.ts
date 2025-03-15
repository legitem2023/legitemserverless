
import { gql } from "@apollo/client"
//*************** QUERIES ***************/
export const READ_CHART_SALES = gql`
query ReadSales($period: String) {
  readSales(period: $period) {
    Interval
    totalSales
  }
}
`

export const MANAGEMENT_INVENTORY = gql`
query GetParentInventory($emailAddress: String) {
  getParentInventory(EmailAddress: $emailAddress) {
    id
    styleCode
    name
    productType
    status
    agentEmail
    brandname
    category
    collectionItem
    dateCreated
    dateUpdated
    childInventory {
      agentEmail
      category
      productType
      brandname
      color
      creator
      dateCreated
      dateUpdated
      editor
      id
      name
      productDescription
    }
  }
}`

export const GET_BRANDS = gql`
query GetBrand {
  getBrand {
    Name
    ProductType
    id
  }
}`

export const GET_CATEGORY = gql`
query GetCategory {
  getCategory {
    id
    Name
    status
    icon
    image
  }
}
`
export const GET_PRODUCT_TYPES = gql`
query GetProductTypes {
  getProductTypes {
    id
    Category
    Name
  }
}
`


export const GET_CHILD_INVENTORY = gql`
query GetChildInventory {
  getChildInventory {
    id
    thumbnail
    price
    productCode
    name
    category
    size
    discount
    color
    stock
    model
    agentEmail
    productType
    style_Code
    brandname
    TotalSoldItems
    TotalRatings
    dateCreated
    dateUpdated
    subImageFieldOut {
      ImagePath
      id
      subImageRelationChild
      subImageRelationParent
    }
    Ratings {
      Ratings
      productCode
      id
      Comment
      By
      Attachment
    }
    Views {
      productCode
    }
  }
}`

export const GET_CHILD_INVENTORY_DETAIL = gql`
query GetChildInventory_details($styleCode: String) {
  getChildInventory_details(styleCode: $styleCode) {
    id
    name
    agentEmail
    category
    color
    creator
    dateCreated
    dateUpdated
    editor
    price
    imageReferences
    productCode
    productType
    size
    status
    stock
    style_Code
    thumbnail
    productDescription
    subImageFieldOut {
      ImagePath
      id
      subImageRelationChild
      subImageRelationParent
    }
  }
}
`
