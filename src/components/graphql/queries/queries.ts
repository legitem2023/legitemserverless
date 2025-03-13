
import { gql } from "@apollo/client"
//*************** QUERIES ***************/
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
