
import { gql } from "@apollo/client"
//*************** QUERIES ***************/

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