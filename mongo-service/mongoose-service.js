/**
 * MongoDB Service Helper Class
 * 
 * Schema should use mongoose-paginate-v2 (https://www.npmjs.com/package/mongoose-paginate-v2)
 * 
 * Example usage:
 * 
 * const mongoosePaginate = require('mongoose-paginate-v2');
 * userGroupSchema.plugin(mongoosePaginate);
 *
 * Reference: https://github.com/maulik-fynd/fynd-tiny-tools/blob/main/mongo-service/mongoDBService.js
 *
 */

class PaginationService {
  static getPageProperties(page = 1, limit = 10) {
    return {
      skip: page ? (page - 1) * limit : 0,
      limit: limit,
    };
  }
}
class MongooseService {
  PAGE_LIMIT = 10;
  DEFAULT_FILTER = {};
  DEFAULT_SELECT = {};
  DEFAULT_SORT = {};

  myCustomLabels = {
    totalDocs: 'item_total',
    page: 'current',
    hasPrevPage: 'has_previous',
    hasNextPage: 'has_next',
    totalPages: 'total',
    limit: false,
    pagingCounter: false,
    nextPage: false,
    prevPage: false,
    offset: false,
  };
  /**
   *
   * @param {*} dbModel Model {mongoose.model}
   * @param {*} errorHandler
   */
  constructor(dbModel, errorHandler = null) {
    this.dbModel = dbModel;
    this.errorHandler = errorHandler;
  }

  /**
   *
   * @param {resourceType} newResource Object which needs to be inserted as a new resource
   * @param {function} errorHandler ( Optional ) ErrorHandler function.
   * @returns {Promise<resourceType>} Created Resource
   */
  async create(newResource, errorHandler = this.errorHandler) {
    try {
      const resource = new this.dbModel(newResource);
      return await resource.save();
    } catch (error) {
      if (!errorHandler) throw new Error(error);
      else errorHandler(error);
    }
  }

  /**
   * Get single resource from database
   *
   * @param {*} params { find: {}, select: {}, populate= "" }
   * @param {function} errorHandler ( Optional )
   * @returns
   */
  async get(params, errorHandler = this.errorHandler) {
    try {
      const { find = this.DEFAULT_FILTER, select = this.DEFAULT_SELECT, populate = '' } = params;
      return await this.dbModel.findOne(find).select(select).populate(populate).lean();
    } catch (error) {
      if (!errorHandler) throw new Error(error);
      else errorHandler(error);
    }
  }

  /**
   * 
   * @param {*} params {
        find = {},
        select = {},
        sort = {},
        skip = 0,
        limit = 0,
        populate = "",
        pagination = true
      }
   * @param {object} resourceName ( Optional ) If provided, will return { resourceName : allResources } as provided 
   * @param {function} errorHandler 
   * @returns 
   */
  async list(params = {}, resourceName = 'resources', errorHandler = this.errorHandler) {
    try {
      const {
        find = this.DEFAULT_FILTER,
        select = this.DEFAULT_SELECT,
        sort = this.DEFAULT_SORT,
        skip = 0,
        limit = this.PAGE_LIMIT,
        populate = '',
        pagination = true,
      } = params;

      const allResources = await this.dbModel.paginate(find, {
        select,
        sort,
        skip,
        limit,
        populate,
        lean: true,
        pagination,
        customLabels: this.myCustomLabels,
      });

      // console.log('allResources :>> ', allResources);

      const { docs,offset, ...page } = allResources;
      return {
        [resourceName]: docs,
        page,
      };
    } catch (error) {
      if (!errorHandler) throw new Error(error);
      else errorHandler(error);
    }
  }

  /**
   *
   * Update a single resource or many in database
   *
   * @param {*} find {}
   * @param {*} updateQuery {}
   * @param {boolean} updateMany ( default: false ) Boolean : Update many records at once.
   * @param {function} errorHandler ( Optional )
   * @returns
   */
  async update(find, updateQuery, updateMany = false, errorHandler = this.errorHandler) {
    try {
      const resource = await this.dbModel;

      if (updateMany) {
        return resource.updateMany(find, updateQuery, {
          new: true,
          runValidators: true,
        });
      }
      return resource
        .findOneAndUpdate(find, updateQuery, {
          new: true,
          runValidators: true,
        })
        .lean();
    } catch (error) {
      if (!errorHandler) throw new Error(error);
      else errorHandler(error);
    }
  }

  async delete(find, deleteMany = false, errorHandler = this.errorHandler) {
    try {
      const resource = this.dbModel;

      if (deleteMany) return await resource.deleteMany(find);

      return await resource.findOneAndDelete(find).lean();
    } catch (error) {
      if (!errorHandler) throw new Error(error);
      else errorHandler(error);
    }
  }

  /**
   * Returns aggregated results for resource
   *
   * @param {*} aggregate {}
   * @param {function} errorHandler
   * @returns
   */
  async aggregate(aggregate, errorHandler = this.errorHandler) {
    try {
      return await this.dbModel.aggregate(aggregate);
    } catch (error) {
      if (!errorHandler) throw new Error(error);
      else errorHandler(error);
    }
  }
}

module.exports = {
  MongooseService,
  PaginationService,
};
