/**
 * MongoDB Service Helper Class
 *
 * Last updated : 8 Oct 2022
 * @author Maulik Pipaliya
 */
class DBService {
  PAGE_LIMIT = 10;
  DEFAULT_FILTER = {};
  DEFAULT_SELECT = {};
  DEFAULT_SORT = {};

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
      const resourceCreated = await resource.save();

      return resourceCreated;
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
      const { find = this.DEFAULT_FILTER, select = this.DEFAULT_SELECT, populate = "" } = params;
      const resource = await this.dbModel.findOne(find).select(select).populate(populate).lean();
      return resource;
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
      }
   * @param {object} resourceName ( Optional ) If provided, will return { resourceName : allResources } as provided 
   * @param {function} errorHandler 
   * @returns 
   */
  async list(params = {}, resourceName = "resources", errorHandler = this.errorHandler) {
    try {
      const {
        find = this.DEFAULT_FILTER,
        select = this.DEFAULT_SELECT,
        sort = this.DEFAULT_SORT,
        skip = 0,
        limit = this.PAGE_LIMIT,
        populate = "",
      } = params;

      const allResources = await this.dbModel
        .find(find)
        .select(select)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate(populate)
        .lean();

      const item_total = await this.dbModel.countDocuments(find);
      return {
        [resourceName]: allResources,
        item_total,
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

  /**
   * Returns aggregated results for resource
   *
   * @param {*} aggregate {}
   * @param {function} errorHandler
   * @returns
   */
  async aggregate(aggregate, errorHandler = this.errorHandler) {
    try {
      const resource = await this.dbModel.aggregate(aggregate);
      return resource;
    } catch (error) {
      if (!errorHandler) throw new Error(error);
      else errorHandler(error);
    }
  }
}

export default {
  DBService,
};
